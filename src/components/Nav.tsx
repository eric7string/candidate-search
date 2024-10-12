import { Link } from 'react-router-dom';

const Nav = () => {
  return (
    <nav style={styles.navbar}>
      <ul style={styles.navList}>
        <li style={styles.navItem}>
          <Link to="/" style={styles.navLink}>Home</Link>
        </li>
        <li style={styles.navItem}>
          <Link to="/SavedCandidates" style={styles.navLink}>Potential Candidates</Link>
        </li>
      </ul>
    </nav>
  );
};

// Inline styles for the navbar and links
const styles = {
  navbar: {
    padding: '10px',
    backgroundColor: '#333',
    textAlign: 'center' as 'center',
  },
  navList: {
    listStyleType: 'none',
    margin: 0,
    padding: 0,
    display: 'flex',
    justifyContent: 'center',
  },
  navItem: {
    margin: '0 15px',
  },
  navLink: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '18px',
  },
};

export default Nav;
