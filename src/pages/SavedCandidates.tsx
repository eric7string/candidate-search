import { useState, useEffect } from 'react';
import { Candidate } from '../interfaces/Candidate.interface'; // Adjust the path as necessary

const SavedCandidates = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [sortedCandidates, setSortedCandidates] = useState<Candidate[]>([]);
  const [sortOption, setSortOption] = useState<string>('added-asc');

  // Function to load candidates from localStorage
  useEffect(() => {
    const savedCandidates = localStorage.getItem('savedCandidates');
    console.log('Raw savedCandidates from localStorage:', savedCandidates); // Log raw data from localStorage

    if (savedCandidates) {
      try {
        const parsedCandidates = JSON.parse(savedCandidates);
        console.log('Parsed candidates:', parsedCandidates); // Log parsed data

        if (Array.isArray(parsedCandidates)) {
          setCandidates(parsedCandidates); // Set state with parsed candidates
          setSortedCandidates(parsedCandidates); // Initially set sorted candidates to the same value
        } else {
          console.error('Parsed candidates is not an array:', parsedCandidates);
        }
      } catch (error) {
        console.error('Error parsing savedCandidates from localStorage:', error);
      }
    } else {
      console.log('No candidates found in localStorage.');
    }
  }, []);

  // Sorting logic
  const sortCandidates = (option: string, candidates: Candidate[]) => {
    console.log('Sorting candidates with option:', option); // Debug log for sorting option
    let sortedCandidates = [...candidates];

    switch (option) {
      case 'name-asc':
        sortedCandidates.sort((a, b) => (a.name || a.login).localeCompare(b.name || b.login));
        break;
      case 'name-desc':
        sortedCandidates.sort((a, b) => (b.name || b.login).localeCompare(a.name || a.login));
        break;
      case 'location-asc':
        sortedCandidates.sort((a, b) => (a.location || '').localeCompare(b.location || ''));
        break;
      case 'location-desc':
        sortedCandidates.sort((a, b) => (b.location || '').localeCompare(a.location || ''));
        break;
      case 'email-asc':
        sortedCandidates.sort((a, b) => (a.email || '').localeCompare(b.email || ''));
        break;
      case 'email-desc':
        sortedCandidates.sort((a, b) => (b.email || '').localeCompare(a.email || ''));
        break;
      case 'company-asc':
        sortedCandidates.sort((a, b) => (a.company || '').localeCompare(b.company || ''));
        break;
      case 'company-desc':
        sortedCandidates.sort((a, b) => (b.company || '').localeCompare(a.company || ''));
        break;
      case 'added-asc':
        // Do nothing, as the default order is ascending
        break;
      case 'added-desc':
        sortedCandidates.reverse();
        break;
      default:
        break;
    }

    setSortedCandidates(sortedCandidates); // Set sorted candidates
    console.log('Sorted candidates:', sortedCandidates); // Debug log for sorted candidates
  };

  // Use effect to sort candidates whenever sortOption changes
  useEffect(() => {
    if (candidates.length > 0) {
      sortCandidates(sortOption, candidates);
    }
  }, [sortOption, candidates]);

  // Function to remove a candidate
  const removeCandidate = (login: string) => {
    const updatedCandidates = candidates.filter(candidate => candidate.login !== login);
    setCandidates(updatedCandidates);
    localStorage.setItem('savedCandidates', JSON.stringify(updatedCandidates)); // Update localStorage
    setSortedCandidates(updatedCandidates); // Update the sorted list as well
  };

  return (
    <div>
      <h1 style={styles.header}>Potential Candidates</h1>

      {/* Dropdown for sorting options */}
      <label htmlFor="sort">Sort By:</label>
      <select
        id="sort"
        value={sortOption}
        onChange={(e) => setSortOption(e.target.value)}
        style={{ marginBottom: '20px', padding: '5px' }}
      >
        <option value="added-asc">Added (Ascending)</option>
        <option value="added-desc">Added (Descending)</option>
        <option value="name-asc">Name (A-Z)</option>
        <option value="name-desc">Name (Z-A)</option>
        <option value="location-asc">Location (A-Z)</option>
        <option value="location-desc">Location (Z-A)</option>
        <option value="email-asc">Email (A-Z)</option>
        <option value="email-desc">Email (Z-A)</option>
        <option value="company-asc">Company (A-Z)</option>
        <option value="company-desc">Company (Z-A)</option>
      </select>

      {/* Table to display candidates */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr>
            <th style={styles.tableHeader}>Image</th>
            <th style={styles.tableHeader}>Name (Username)</th>
            <th style={styles.tableHeader}>Location</th>
            <th style={styles.tableHeader}>Email</th>
            <th style={styles.tableHeader}>Company</th>
            <th style={styles.tableHeader}>Bio</th>
            <th style={styles.tableHeader}>Reject</th>
          </tr>
        </thead>
        <tbody>
          {sortedCandidates.length > 0 ? (
            sortedCandidates.map((candidate) => (
              <tr key={candidate.login} style={styles.tableRow}>
                <td style={styles.tableCell}>
                  <img
                    src={candidate.avatar_url}
                    alt="Avatar"
                    style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                  />
                </td>
                <td style={styles.tableCell}>
                  {candidate.name || 'N/A'} ({candidate.login})
                </td>
                <td style={styles.tableCell}>{candidate.location || 'N/A'}</td>
                <td style={styles.tableCell}>{candidate.email || 'N/A'}</td>
                <td style={styles.tableCell}>{candidate.company || 'N/A'}</td>
                <td style={styles.tableCell}>{candidate.bio || 'N/A'}</td>
                <td style={styles.tableCell}>
                  <button onClick={() => removeCandidate(candidate.login)} style={styles.rejectButton}>
                    Reject
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} style={styles.tableCell}>
                No candidates saved.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

// Inline styles for table and buttons
const styles = {
  tableHeader: {
    padding: '10px',
    border: '1px solid #ddd',
    
  },
  tableRow: {
    borderBottom: '1px solid #ddd',
  },
  tableCell: {
    padding: '10px',
    border: '1px solid #ddd',
    textAlign: 'center' as 'center',
  },
  rejectButton: {
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    padding: '5px 10px',
    cursor: 'pointer',
    borderRadius: '4px',
  },
  header: {
    textAlign: 'center' as 'center', // Center the header text
    marginBottom: '20px', // Optional: add some spacing below the header
  },
};

export default SavedCandidates;
