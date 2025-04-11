import styles from "./homepage.module.css";
import { Link, useNavigate } from "react-router-dom";
import Image from "../../svgs/SVG/SVG/mn.png";
import axios from "axios";
import { useContext, useRef } from "react";
import LoginContext from "../../context/context";

function Homepage() {
  const navigate = useNavigate();
  const { logout, loggedIn } = useContext(LoginContext);

  const about = useRef(null);
  const articles = useRef(null);

  const aboutClick = () => {
    about.current?.scrollIntoView({ behavior: "smooth" });
  };
  const articlesClick = () => {
    articles.current?.scrollIntoView({ behavior: "smooth" });
  };

  const logoutUser = async () => {
    try {
      const { data } = await axios.get(
        process.env.REACT_APP_API_LINK + "/logout",
        {
          withCredentials: true,
        }
      );
      console.log(data);
      if (data?.msg === "loggedout") {
        logout();
      }
    } catch (error) {
      console.log("Err in logout");
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className={styles.homepageContainer}>
      
      <main style={{ minHeight: "100vh" }}>
        <section className={styles.leftSection}>
          <h1>
          Mental Health  <br /> Solutions Powered by AI{" "}

          </h1>
          <div
            className={styles.chatWithUs}
            onClick={() => {
              navigate("/message");
            }}
          >
            share with us...<span className={styles.cursor}></span>
          </div>
        </section>
        <section className={styles.rightSection}>
          <img src={Image} alt="" />
        </section>
      </main>
      
      <footer className={styles.footer}>
        <div className="m-auto" style={{ maxWidth: "1320px" }}>
          <div className="text-center">© 2025 by MindMetrics</div>
        </div>
      </footer>
      <button className={styles.scrollButton} onClick={scrollToTop}>
        &#9650;
      </button>
    </div>
  );
}

export default Homepage;
