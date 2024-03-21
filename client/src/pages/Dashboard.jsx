import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import io from 'socket.io-client';

const Dashboard = () => {
  const [token, setToken] = useState(JSON.parse(localStorage.getItem("auth")) || "");
  const [users, setUsers] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [sortBy, setSortBy] = useState("email");
  const [sortOrder, setSortOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();
  const loader = useRef(null);
  const [message, setMessage] = useState();
  const [socketData, setSocketData] = useState();
  
  useEffect(() => {
    // Fetch user data when component mounts
    const socket = io('http://localhost:3000'); 
    fetchUserData();
    if (token === "") {
      navigate("/login");
      toast.warn("Please login first to access dashboard");
    }
    socket.on("connect", () => {
      console.log(socket.id); // x8WIv7-mJelg7on_ALbx
    });

    socket.on('welcome', (user) => {
     
      
      setMessage(user);
    });

    socket.on("registration", (data) => {
      
      setSocketData(data);
      console.log("New user registered:", data);
    });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      // Disconnect socket when component unmounts
      socket.disconnect(); 
    };
  }, [token]);
  if (socketData?.name) {
    toast.success(`New User Registered ${socketData.name}`);
  }
  useEffect(() => {
   
    if (!hasMore || !loader.current) return;
  
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setPage(prevPage => prevPage + 1);
      }
    });
  
    observer.observe(loader.current);
  
    return () => {
      if (loader.current) {
        observer.unobserve(loader.current);
      }
    };
  }, [hasMore, loader]);
  
  // Function to fetch user data
  const fetchUserData = async () => {
    try {
      const { data } = await axios.get(`http://localhost:3000/api/v1/users?page=${page}`);
      setUsers(prevUsers => {
        // Remove duplicate users from the new data
        const uniqueUsers = data.users.filter(newUser => !prevUsers.find(prevUser => prevUser._id === newUser._id));
        return [...prevUsers, ...uniqueUsers];
      });
      setHasMore(data.hasMore);
    } catch (error) {
      toast.error(error.message);
    }
  }
  // Function to handle user deletion
  const deleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:3000/api/v1/users/${userId}`);
      // Refresh user data after deletion
      fetchUserData();
      toast.success("User deleted successfully");
    } catch (error) {
      toast.error(error.message);
    }
  }
 
  // Function to handle search input change
  const handleSearchInputChange = (event) => {
    const inputValue = event.target.value.toLowerCase();
    setSearchInput(inputValue);
    setUsers(prevUsers => {
      return prevUsers.filter(user => 
        user.name.toLowerCase().includes(inputValue) || 
        user.email.toLowerCase().includes(inputValue)
      );
    });
  }
  // Function to handle sorting
  const handleSort = (key) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortOrder("asc");
    }
  }

  // Function to handle scroll event for infinite scroll
  const handleScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight) {
      setPage(prevPage => prevPage + 1);
    }
  }

  // Filter and sort users based on search input and sorting order
  let filteredUsers = users.filter(user => user.email.toLowerCase().includes(searchInput.toLowerCase()));
  filteredUsers = filteredUsers.sort((a, b) => {
    const compareValue = sortOrder === "asc" ? 1 : -1;
    return compareValue * (a[sortBy].localeCompare(b[sortBy]));
  });

  return (
    <div style={styles.container}>
      {/* <div>
        <h2>Welcome Message from Server:{message}</h2>
      
      </div> */}
      <h1 style={styles.title}>Dashboard</h1>
      <div style={styles.controlsContainer}>
        <div style={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search by email"
            value={searchInput}
            onChange={handleSearchInputChange}
            style={styles.searchInput}
          />
        </div>
        <div style={styles.sortContainer}>
          <label style={styles.sortLabel}>Sort By:</label>
          <select onChange={(e) => handleSort(e.target.value)} style={styles.sortSelect}>
            <option value="email">Email</option>
            <option value="name">Name</option>
            {/* Add more options for other fields if needed */}
          </select>
        </div>
      </div>
      <InfiniteScroll
  dataLength={users.length} // This is important field to render the next data
  next={fetchUserData}
  hasMore={hasMore}
  loader={<h4 style={{ textAlign: 'center' }}>Loading...</h4>} // Adjusted loader style
  endMessage={
    <p style={{ textAlign: 'center' }}>
      <b>Yay! You have seen it all</b>
    </p>
  }
  // below props only if you need pull down functionality
  refreshFunction={fetchUserData}
  pullDownToRefresh
  pullDownToRefreshThreshold={50}
  pullDownToRefreshContent={
    <h3 style={{ textAlign: 'center' }}>&#8595; Pull down to refresh</h3>
  }
  releaseToRefreshContent={
    <h3 style={{ textAlign: 'center' }}>&#8593; Release to refresh</h3>
  }
>

        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.columnHeader}>Username</th>
                <th style={styles.columnHeader}>Email</th>
                <th style={styles.columnHeader}>Password</th>
                <th style={styles.columnHeader}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr key={user.id}>
                  <td style={styles.cell}>{user.name}</td>
                  <td style={styles.cell}>{user.email}</td>
                  <td style={styles.cell}>{user.password}</td>
                  <td style={styles.cell}>
                    <button style={styles.button} onClick={() => navigate(`/edit/${user._id}`)}>Edit</button>
                    <button style={{...styles.button, ...styles.deleteButton}} onClick={() => deleteUser(user._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </InfiniteScroll>
    </div>
  )
}

export default Dashboard;

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
  },
  title: {
    marginBottom: '20px',
    textAlign: 'center',
    fontSize: '24px',
  },
  controlsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '20px',
  },
  searchContainer: {
    flex: '1',
    marginRight: '10px',
  },
  searchInput: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    boxSizing: 'border-box',
    outline: 'none',
  },
  sortContainer: {
    flex: '1',
    display: 'flex',
    alignItems: 'center',
  },
  sortLabel: {
    marginRight: '10px',
  },
  sortSelect: {
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    boxSizing: 'border-box',
    outline: 'none',
  },
  tableContainer: {
    overflowX: 'auto',
    position: 'relative',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  columnHeader: {
    padding: '12px',
    backgroundColor: '#f2f2f2',
    textAlign: 'left',
  },
  cell: {
    padding: '12px',
    borderBottom: '1px solid #ddd',
    wordBreak: 'break-word',
  },
  button: {
    padding: '8px 16px',
    marginRight: '8px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    color: '#fff',
    backgroundColor: '#4CAF50',
  },
  deleteButton: {
    backgroundColor: '#f44336',
  },
  loader: {
    position: 'absolute',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    borderTop: '4px solid #3498db',
    borderRight: '4px solid transparent',
    animation: 'spin 1s linear infinite',
  },
  '@keyframes spin': {
    '0%': {
      transform: 'rotate(0deg)',
    },
    '100%': {
      transform: 'rotate(360deg)',
    },
  },
};

// Media queries for responsive design
const mediaQueries = {
  '@media only screen and (max-width: 600px)': {
    tableContainer: {
      overflowX: 'auto',
      width: '100%',
    },
    table: {
      width: '100%',
    },
    cell: {
      padding: '8px',
    },
    button: {
      padding: '6px 12px',
      fontSize: '14px',
    },
    columnHeader: {
      padding: '8px',
      fontSize: '14px',
    },
    title: {
      fontSize: '20px',
    },
  }
};

Object.assign(styles, mediaQueries);


