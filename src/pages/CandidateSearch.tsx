// CandidateSearch.tsx

import { useState, useEffect } from 'react';
import { searchGithub, searchGithubUser } from '../api/API'; // Correct casing for API import
import { Candidate } from '../interfaces/Candidate.interface'; // Correct casing for interface import

const CandidateSearch = () => {
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchCandidate = async () => {
    setLoading(true);
    try {
      // Fetch a random user list
      const users = await searchGithub();
      if (users.length > 0) {
        // Fetch detailed information of the first user
        const candidateData = await searchGithubUser(users[0].login);
        setCandidate(candidateData); // Set the candidate data
      } else {
        setCandidate(null); // Handle case when no candidates are found
      }
    } catch (error) {
      console.error('Error fetching candidate:', error);
      setCandidate(null);
    }
    setLoading(false);
  };

  // Function to save the candidate to localStorage
  const saveCandidate = () => {
    if (candidate) {
      const savedCandidates = localStorage.getItem('savedCandidates');
      let candidatesArray: Candidate[] = savedCandidates ? JSON.parse(savedCandidates) : [];

      const candidateExists = candidatesArray.some(savedCandidate => savedCandidate.login === candidate.login);
      if (!candidateExists) {
        candidatesArray.push(candidate);
        localStorage.setItem('savedCandidates', JSON.stringify(candidatesArray));
        console.log('Candidate saved to localStorage:', candidate);
      } else {
        console.log('Candidate already exists in saved candidates.');
      }

      fetchCandidate(); // Fetch a new candidate after saving
    }
  };

  // Fetch a candidate when the component mounts
  useEffect(() => {
    fetchCandidate();
  }, []);

  if (loading) {
    return <p>Loading candidate...</p>;
  }

  if (!candidate) {
    return <p>No candidate found.</p>;
  }

  return (
    <main>
      {/* Candidate Card */}
      <h1>Candidate Search</h1>
      <div style={styles.card}>
        <img src={candidate.avatar_url} alt="Avatar" style={styles.avatar} />
        <div style={styles.cardDetails}>
          <h2>{candidate.name || 'Unknown Name'} ({candidate.login})</h2>
          <p><strong>Location:</strong> {candidate.location || 'Unknown Location'}</p>
          <p><strong>Email:</strong> {candidate.email || 'Unknown Email'}</p>
          <p><strong>Company:</strong> {candidate.company || 'Unknown Company'}</p>
          <p><strong>Bio:</strong> {candidate.bio || 'No bio available'}</p>
        </div>
      </div>

      {/* Buttons */}
      <div style={styles.buttonContainer}>
        <button style={styles.skipButton} onClick={fetchCandidate}>
          &minus;
        </button>
        <button style={styles.saveButton} onClick={saveCandidate}>
          &#43; 
        </button>
      </div>
    </main>
  );
};

// Inline styles for card and buttons
const styles = {
  card: {
    border: '5px solid black', // Black border around the card
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
    borderRadius: '15px',
    width: '250px',
    height: '250px',
    marginBottom: '16px',
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
