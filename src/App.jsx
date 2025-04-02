import { useState, useEffect } from 'react'
import './App.css'
import teaserFigure from './assets/figures/teaser_figure1.png'

function Header() {
  // This function will be removed
}

function Hero() {
  return (
    <section className="hero">
      <div className="container">
        <h1>IMPersona: Evaluating Individual Level LM Impersonation</h1>
        <p className="authors">
          <a href="https://benshi34.github.io/" target="_blank" rel="noopener noreferrer" className="author-link">Quan Shi</a>,{" "}
          <a href="https://www.carlosejimenez.com/" target="_blank" rel="noopener noreferrer" className="author-link">Carlos E. Jimenez</a>,{" "}
          Stephen Dong,{" "}
          Brian Seo,{" "}
          Adam Kelch,{" "}
          <a href="https://karthikncode.github.io/" target="_blank" rel="noopener noreferrer" className="author-link">Karthik Narasimhan</a>
        </p>
        <p className="authors affiliation no-margin-top">
          Princeton University and Princeton Language and Intelligence
        </p>
        <div className="hero-buttons">
          <a href="https://arxiv.org/abs/yourpaper" target="_blank" rel="noopener noreferrer" className="button">Read the Paper</a>
          <a href="https://github.com/yourusername/impersona" target="_blank" rel="noopener noreferrer" className="button btn-secondary">GitHub</a>
        </div>
      </div>
    </section>
  );
}

function Research() {
  return (
    <section id="research" className="research">
      <div className="container">
        <div className="section-title">
          <h2>Abstract</h2>
        </div>
        
        <div className="research-content">
          <div className="abstract-container">
            <p className="abstract-text">
              As language models achieve increasingly human-like capabilities in conversational text generation, 
              a critical question emerges: to what extent can these systems simulate the characteristics of specific individuals?
              To evaluate this, we introduce IMPersona, a framework for evaluating LMs at impersonating specific individuals' 
              writing style and personal knowledge. Using supervised fine-tuning and a hierarchical memory-inspired retrieval system, 
              we demonstrate that even modestly sized open-source models, such as Llama-3.1-8B-Instruct, can achieve impersonation 
              abilities at concerning levels. In blind conversation experiments, participants (mis)identified our fine-tuned models 
              with memory integration as human in <strong>44.44%</strong> of interactions, compared to just <strong>25.00%</strong> 
              for the best prompting-based approach. We analyze these results to propose detection methods and defense strategies 
              against such impersonation attempts. Our findings raise important questions about both the potential applications and 
              risks of personalized language models, particularly regarding privacy, security, and the ethical deployment of such 
              technologies in real-world contexts.
            </p>
          </div>
          
          <div className="research-figure" style={{ maxWidth: "80%", margin: "0 auto" }}>
            <img src={teaserFigure} alt="Model performance across different configurations" style={{ width: "100%" }} />
            <p className="caption">
              Model performance across different configurations. Pass rate indicates the percentage of conversations 
              where participants identified the model as human, while humanness rating (1-7) reflects participants' 
              confidence in their human/AI assessment.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ChatVisualizer() {
  const [chatData, setChatData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chatFiles, setChatFiles] = useState([]);
  const [currentChatIndex, setCurrentChatIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // Use Vite's import.meta.glob to get all chat files
    const chatModules = import.meta.glob('/src/assets/chats/*.json', { eager: true });
    
    // Extract filenames from the module paths
    const files = Object.keys(chatModules).map(path => path.split('/').pop());
    
    if (files.length > 0) {
      setChatFiles(files);
      // Load the first chat file
      setChatData(chatModules[Object.keys(chatModules)[0]].default || chatModules[Object.keys(chatModules)[0]]);
      setLoading(false);
    } else {
      setError('No chat files found');
      setLoading(false);
    }
  }, []);

  const navigateToChat = (direction) => {
    if (isTransitioning) return; // Prevent rapid clicking during transition
    
    setIsTransitioning(true);
    setSlideDirection(direction > 0 ? 'slide-left' : 'slide-right');
    
    // Short delay to allow exit animation to play
    setTimeout(() => {
      let newIndex = currentChatIndex + direction;
      
      // Wrap around if we go past the ends
      if (newIndex < 0) {
        newIndex = chatFiles.length - 1;
      } else if (newIndex >= chatFiles.length) {
        newIndex = 0;
      }
      
      setCurrentChatIndex(newIndex);
      
      // Get the full path of the selected chat file
      const fullPath = `/src/assets/chats/${chatFiles[newIndex]}`;
      
      // Get the chat data from the already loaded modules
      const chatModules = import.meta.glob('/src/assets/chats/*.json', { eager: true });
      setChatData(chatModules[fullPath].default || chatModules[fullPath]);
      
      // Reset slide direction for entry animation
      setSlideDirection(direction > 0 ? 'slide-right-in' : 'slide-left-in');
      
      // End transition state after animation completes
      setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
    }, 300);
  };

  if (loading) return <div className="loading">Loading chat...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!chatData) return null;

  return (
    <section id="chat-samples" className="chat-samples">
      <div className="container">
        <div className="section-title">
          <h2>Sample Conversations</h2>
          <p>See examples of conversations between users and our impersonation models</p>
        </div>
        
        <div className="chat-container">
          <div className="chat-header">
            <div className="chat-topic">
              <h3>Topic: {chatData.topic.category}</h3>
              <p>{chatData.topic.prompt}</p>
            </div>
          </div>
          
          <div className="chat-navigation">
            <span className="chat-counter">
              Chat {currentChatIndex + 1} of {chatFiles.length}
            </span>
            {chatData.model && (
              <span className="chat-model">
                Model: <strong>{chatData.model}</strong>
              </span>
            )}
          </div>
          
          <div className={`chat-messages ${slideDirection}`}>
            {chatData.messages.map((message, index) => (
              <div 
                key={index} 
                className={`message ${message.sender === 'admin' ? 'message-admin' : 'message-user'}`}
              >
                <div className="message-bubble">
                  <p>{message.text}</p>
                </div>
                <div className="message-timestamp">{message.timestamp}</div>
              </div>
            ))}
          </div>
          
          {/* Add guess information section */}
          {(chatData.guess || chatData.humanness || chatData.reason) && (
            <div className="chat-evaluation">
              <h4>Participant Evaluation</h4>
              <div className="evaluation-details">
                <div className="evaluation-row">
                  {chatData.guess && (
                    <div className="evaluation-item flex-equal">
                      <span className="evaluation-label">Guess:</span>
                      <span className="evaluation-value">{chatData.guess}</span>
                    </div>
                  )}
                  {chatData.humanness && (
                    <div className="evaluation-item flex-equal">
                      <span className="evaluation-label">Humanness Rating:</span>
                      <span className="evaluation-value">
                        <span className="humanness-rating">{chatData.humanness}/7</span>
                      </span>
                    </div>
                  )}
                </div>
                
                {chatData.reason && (
                  <div className="evaluation-row reason-row">
                    <div className="evaluation-item full-width">
                      <span className="evaluation-label">Reason:</span>
                      <span className="evaluation-value">"{chatData.reason}"</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <div className="chat-controls">
            <button 
              className="nav-button prev-button" 
              onClick={() => navigateToChat(-1)}
              aria-label="Previous chat"
              disabled={isTransitioning}
            >
              ←
            </button>
            <button 
              className="nav-button next-button" 
              onClick={() => navigateToChat(1)}
              aria-label="Next chat"
              disabled={isTransitioning}
            >
              →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Team() {
  const teamMembers = [
    {
      name: "Quan Shi",
      role: "Researcher",
      image: "/images/team/quan.jpg",
      email: "qbshi@princeton.edu"
    },
    {
      name: "Carlos E. Jimenez",
      role: "Researcher",
      image: "/images/team/carlos.jpg",
      email: "carlosej@princeton.edu"
    },
    {
      name: "Stephen Dong",
      role: "Researcher",
      image: "/images/team/stephen.jpg",
      email: "example@princeton.edu"
    },
    {
      name: "Brian Seo",
      role: "Researcher",
      image: "/images/team/brian.jpg",
      email: "example@princeton.edu"
    },
    {
      name: "Adam Kelch",
      role: "Researcher",
      image: "/images/team/adam.jpg",
      email: "example@princeton.edu"
    },
    {
      name: "Karthik Narasimhan",
      role: "Principal Investigator",
      image: "/images/team/karthik.jpg",
      email: "example@princeton.edu"
    }
  ];

  return (
    <section id="team" className="team">
      <div className="container">
        <div className="section-title">
          <h2>Our Team</h2>
        </div>
        
        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <div className="team-member" key={index}>
              <img src={member.image} alt={member.name} />
              <h3>{member.name}</h3>
              <p>{member.role}</p>
              <p><a href={`mailto:${member.email}`}>{member.email}</a></p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Publications() {
  return (
    <section id="Citation" className="publications">
      <div className="container">
        <div className="section-title">
          <h2>Citation</h2>
        </div>
        <div className="publication-card">
          <pre className="bibtex-citation" style={{ textAlign: 'left' }}>
            {`@inproceedings{shi2024impersona,
  title={IMPersona: Evaluating Individual Level LM Impersonation},
  author={Shi, Quan and Jimenez, Carlos E. and Dong, Stephen and Seo, Brian and Kelch, Adam and Narasimhan, Karthik},
  booktitle={arxiv},
  year={2025}
}`}
          </pre>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-content">
          <div className="footer-column">
            <h3>IMPersona</h3>
            <p>
              A research project from Princeton Language and Intelligence (PLI) 
              evaluating individual-level language model impersonation.
            </p>
          </div>
          
          <div className="footer-column">
            <h3>Links</h3>
            <ul className="footer-links">
              <li><a href="#research">Research</a></li>
              <li><a href="#demo">Demo</a></li>
              <li><a href="#team">Team</a></li>
              <li><a href="#publications">Publications</a></li>
              <li><a href="https://github.com/yourusername/impersona" target="_blank" rel="noopener noreferrer">GitHub</a></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h3>Contact</h3>
            <ul className="footer-links">
              <li><a href="mailto:qbshi@princeton.edu">qbshi@princeton.edu</a></li>
              <li><a href="mailto:carlosej@princeton.edu">carlosej@princeton.edu</a></li>
              <li><a href="https://pli.princeton.edu" target="_blank" rel="noopener noreferrer">Princeton Language and Intelligence</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Princeton Language and Intelligence. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

function App() {
  return (
    <div className="app-container">
      <main>
        <Hero />
        <Research />
        <ChatVisualizer />
        <Publications />
      </main>
      <Footer />
    </div>
  )
}

export default App
