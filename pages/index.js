import { useEffect, useState } from "react";
import { db, fetchProjects } from "../utils/firebase";
import AddLinkPopup from "./addLink"; // Import the popup
import { FaGithub, FaExternalLinkAlt, FaArrowUp, FaLink, FaAngleDoubleRight } from 'react-icons/fa';

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [showAddLink, setShowAddLink] = useState(false); // State for popup
  const [expandedCard, setExpandedCard] = useState(null);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isFooterVisible, setIsFooterVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isScrollToTopVisible, setIsScrollToTopVisible] = useState(false);

  const fetchData = async () => {
    let data = await fetchProjects();
    setProjects(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 50) {
        setIsHeaderVisible(false);
        setIsFooterVisible(true);
        setIsScrollToTopVisible(true)

      } else {
        setIsHeaderVisible(true);
        setIsFooterVisible(false);
        setIsScrollToTopVisible(false);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleCardExpansion = (id) => {
    setExpandedCard((prev) => (prev === id ? null : id));
  };

  return (
    <div className="container">
      <header className={`header ${isHeaderVisible ? "visible" : "hidden"}`}>
        <img
          className="logo"
          src="neeraj-logo.png"
          alt="Logo"
          onClick={() => window.open('https://neerajdhurandher.me', '_blank')}
        />
        <h1 style={{ alignItems: 'center', gap: '10px' }}>
          <FaLink style={{ color: 'var(--primary-color)' }} /> Link Store
        </h1>
        <button
          className="add-link-btn"
          onClick={() => setShowAddLink(true)}
        >
          + Add Link
        </button>
      </header>

      <main>
        <div className="projects-list">
          {projects.map((project) => (
            <div
              className={`project-card ${expandedCard === project.id ? 'expanded' : ''}`}
              key={project.id}
            >
              <div className="main-info">
                <div className="project-info">
                  <h2>{project.projectName}</h2>
                  <p>{project.projectDescription}</p>
                </div>
                <div className="project-actions">
                  <a href={project.accessLink} target="_blank" rel="noopener noreferrer">
                    <button className="open">
                      <FaExternalLinkAlt style={{ marginRight: '5px' }} /> Open
                    </button>
                  </a>
                  <a href={project.githubLink} target="_blank" rel="noopener noreferrer">
                    <button className="github">
                      <FaGithub style={{ marginRight: '5px' }} /> GitHub
                    </button>
                  </a>
                  <a href={project.accessLink} target="_blank" rel="noopener noreferrer">
                    <button className="more">
                      <FaAngleDoubleRight style={{ marginRight: '5px' }} /> More
                    </button>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className={`footer ${isFooterVisible ? "visible" : "hidden"}`}>
        Thank you for exploring my projects! Your interest means a lot to me.
        <span style={{ color: "red", fontSize: "1.3rem" }}>♥</span>
      </footer>

      {showAddLink && (
        <AddLinkPopup onClose={() => setShowAddLink(false)} />
      )}

      {isScrollToTopVisible && (
        <div
          className="scroll-to-top"
          onClick={scrollToTop}
        >
          <FaArrowUp />
        </div>
      )}
    </div>
  );
}
