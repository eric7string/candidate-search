import { useState, useEffect } from 'react';
import { searchGithub, searchGithubUser } from '../api/API';
import { Candidate } from '../interfaces/Candidate.interface'; // Adjust the path as necessary

const CandidateSearch = () => {
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Function to fetch a random user
  const fetchRandomCandidate = async () => {
    setLoading(true);
    try {
      const users = await searchGithub();
      if (users.length > 0) {
        for (const randomUser of users) {
          const candidateData = await searchGithubUser(randomUser.login);
          setCandidate(candidateData); // Set candidate regardless of filled fields
          break; // Exit after finding the first user
        }
      } else {
        setCandidate(null);
      }
    } catch (error) {
      console.error('Error fetching candidate:', error);
      setCandidate(null);
    } finally {
      setLoading(false);
    }
  };

  // Function to save candidate to localStorage
  const saveCandidate = () => {
    if (candidate) {
      const savedCandidates = localStorage.getItem('savedCandidates');
      let candidatesArray: Candidate[] = savedCandidates ? JSON.parse(savedCandidates) : [];

      const candidateExists = candidatesArray.some(savedCandidate => savedCandidate.login === candidate.login);
      if (!candidateExists) {
        candidatesArray.push(candidate);
        localStorage.setItem('savedCandidates', JSON.stringify(candidatesArray));
      }
      fetchRandomCandidate();
    }
  };

  useEffect(() => {
    fetchRandomCandidate();
  }, []);

  if (loading) {
    return <p>Loading candidate...</p>;
  }

  if (!candidate) {
    return <p>No candidate found.</p>;
  }

  return (
    <main>
     
      {/* Centered Header */}
      <h1>Candidate Search</h1>

      {/* Candidate Card */}
      <div style={styles.card}>
        <img src={candidate.avatar_url} alt="Avatar" style={styles.avatar} />
        <div style={styles.cardDetails}>
          <h2 style={styles.name}>
            {candidate.name || 'Unknown Name'} <span style={styles.username}>({candidate.login})</span>
          </h2>
          <p><strong>Location:</strong> {candidate.location || 'Unknown Location'}</p>
          <p><strong>Email:</strong> <a href={`mailto:${candidate.email}`} style={styles.email}>{candidate.email || 'Unknown Email'}</a></p>
          <p><strong>Company:</strong> {candidate.company || 'Unknown Company'}</p>
          <p><strong>Bio:</strong> {candidate.bio || 'No bio available'}</p>
        </div>
      </div>

      {/* Circular Buttons below the card */}
      <div style={styles.buttonContainer}>
        <button style={styles.skipButton} onClick={fetchRandomCandidate}>
          &minus;
        </button>
        <button style={styles.saveButton} onClick={saveCandidate}>
          &#43;
        </button>
      </div>
    </main>
  );
};

// Inline Styles for card and buttons
const styles = {
  card: {
    border: '1px solid #ddd',
    borderRadius: '15px', // Rounded corners
    padding: '20px',
    maxWidth: '400px',
    margin: '20px auto', // Center the card
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    textAlign: 'center' as 'center',
  },
  cardDetails: {
    backgroundColor: '#000',
    color: '#fff',
    borderRadius: '15px',
    padding: '10px',
    marginTop: '10px',
  },
  avatar: {
    borderRadius: '50%',
    width: '150px',
    height: '150px',
    marginBottom: '16px',
  },
  name: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  username: {
    fontStyle: 'italic',
  },
  email: {
    color: '#646cff', // Matches the link color in the provided CSS
  },
  buttonContainer: {
    marginTop: '20px',
    display: 'flex',
    justifyContent: 'center', // Align buttons in the center
    gap: '30px', // Space between the buttons
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    color: 'white',
    borderRadius: '50%', // Circular button
    width: '60px',
    height: '60px',
    fontSize: '24px',
    border: 'none',
    cursor: 'pointer',
    display: 'flex', // Use flexbox
    alignItems: 'center', // Center vertically
    justifyContent: 'center', // Center horizontally
  },
  skipButton: {
    backgroundColor: '#f44336',
    color: 'white',
    borderRadius: '50%', // Circular button
    width: '60px',
    height: '60px',
    fontSize: '24px',
    border: 'none',
    cursor: 'pointer',
    display: 'flex', // Use flexbox
    alignItems: 'center', // Center vertically
    justifyContent: 'center', // Center horizontally
  },
};



export default CandidateSearch;
