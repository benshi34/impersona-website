/**
 * Chat Model Editor
 * 
 * This script allows you to view and edit chat files to add model information.
 * It also provides an option to delete files with unwanted content.
 * Run this with Node.js to process your chat files.
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

// Get the directory name properly in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CHATS_DIRECTORY = path.join(__dirname, '../assets/chats');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Get all chat files
function getChatFiles() {
  return fs.readdirSync(CHATS_DIRECTORY)
    .filter(file => file.endsWith('.json'));
}

// Display chat content
function displayChatContent(chatData) {
  console.log('\n========== CHAT CONTENT ==========');
  console.log(`Topic: ${chatData.topic.category} - ${chatData.topic.prompt}`);
  
  if (chatData.model) {
    console.log(`Current model: ${chatData.model}`);
  } else {
    console.log('No model information set');
  }
  
  console.log('\nMessages:');
  chatData.messages.forEach((message, index) => {
    console.log(`[${message.timestamp}] ${message.sender}: ${message.text}`);
  });
  console.log('==================================\n');
}

// Process a single chat file
function processChatFile(filename) {
  const filePath = path.join(CHATS_DIRECTORY, filename);
  const chatData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  displayChatContent(chatData);
  
  rl.question(`Options: [m] Add model name, [d] Delete file, [s] Skip: `, (answer) => {
    const option = answer.trim().toLowerCase();
    
    if (option === 'd') {
      // Delete the file
      rl.question(`Are you sure you want to delete ${filename}? (y/n): `, (confirmation) => {
        if (confirmation.trim().toLowerCase() === 'y') {
          fs.unlinkSync(filePath);
          console.log(`Deleted ${filename}`);
          // Refresh the file list after deletion
          currentFileIndex--;
          chatFiles.splice(chatFiles.indexOf(filename), 1);
        } else {
          console.log(`Kept ${filename}`);
        }
        processNextFile();
      });
    } else if (option === 'm') {
      // Add model name
      rl.question(`Enter model name for this chat: `, (modelName) => {
        if (modelName.trim()) {
          chatData.model = modelName.trim();
          fs.writeFileSync(filePath, JSON.stringify(chatData, null, 2));
          console.log(`Updated ${filename} with model: ${modelName}`);
        } else {
          console.log(`No model name provided, skipping update for ${filename}`);
        }
        processNextFile();
      });
    } else {
      // Skip this file
      console.log(`Skipped ${filename}`);
      processNextFile();
    }
  });
}

// Process files one by one
let currentFileIndex = 0;
let chatFiles = getChatFiles();

function processNextFile() {
  if (currentFileIndex < chatFiles.length) {
    console.log(`\nProcessing file ${currentFileIndex + 1}/${chatFiles.length}: ${chatFiles[currentFileIndex]}`);
    processChatFile(chatFiles[currentFileIndex]);
    currentFileIndex++;
  } else {
    console.log('\nAll files processed!');
    rl.close();
  }
}

// Start processing
console.log(`Found ${chatFiles.length} chat files in ${CHATS_DIRECTORY}`);
if (chatFiles.length > 0) {
  processNextFile();
} else {
  console.log('No chat files found.');
  rl.close();
} 