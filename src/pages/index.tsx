// index.tsx
import { useEffect, useState } from 'react';
import styles from '@/styles/styles.module.css';

// Define a type for permissions
type Permission = {
  add_users: string;
  delete_messages: string;
  delete_users: string;
};

export default function Home() {
  const [data, setData] = useState({
    usernames: [],
    firstnames: [],
    permissions: [] as Permission[],
    // allusers: []
  });

  useEffect(() => {
    async function getPageData() {
      const apiUrlEndpoint = `http://localhost:3000/api/getData`;
      const response = await fetch(apiUrlEndpoint);
      const res = await response.json();
      console.log(res);
      setData(res);
    }
    getPageData();
  }, []);

  return (
    <div className={styles.container}>
      <header>
        <h1 className={styles.title}>Player Statistics Dashboard</h1>
        <p className={styles.subtitle}>AI Poker Coach</p>
      </header>

      <div className={styles.dashboard}>
        <div className={`${styles.section} ${styles['box']}`}>
          <h3>Usernames of all users aged 25 and above</h3>
          <ul className={styles['section-ul']}>
            {data.usernames.map((username, index) => (
              <li key={index} className={styles['section-li']}>{username}</li>
            ))}
          </ul>
        </div>

        
        {/* <div className={`${styles.section} ${styles['box']}`}>
          <h3>Usernames of all users aged under 25</h3>
          <ul className={styles['section-ul']}>
            {data.allusers.map((allusers, index) => (
              <li key={index} className={styles['section-li']}>{allusers}</li>
            ))}
          </ul>
        </div> */}

        <div className={`${styles.section} ${styles['box']}`}>
          <h3>First name of user with username "ZL"</h3>
          <ul className={styles['section-ul']}>
            {data.firstnames.map((firstname, index) => (
              <li key={index} className={styles['section-li']}>{firstname}</li>
            ))}
          </ul>
        </div>

        <div className={`${styles.section} ${styles['box']}`}>
          <h3>Permissions of user with first name "Edward"</h3>
          <ul className={styles['section-ul']}>
            {data.permissions.map((permission, index) => (
              <li key={index} className={styles['section-li']}>
                <strong>Add Users:</strong> {permission.add_users},
                <br />
                <strong>Delete Messages:</strong> {permission.delete_messages},
                <br />
                <strong>Delete Users:</strong> {permission.delete_users}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
