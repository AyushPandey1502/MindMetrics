import "./Blogsss.css"; // Changed to standard CSS import
import img1 from './1.jpg';
import img2 from './2.jpg';
import img3 from './3.jpg';
import img4 from './4.jpg';
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useContext, useRef } from "react";
import LoginContext from "../../context/context";
import Articles from "../Articles/Articles";
import piechart from "../../svgs/piechart.png";

function Blogs() {
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
    <div className="homepageContainer">
      <section className="mt-8" ref={articles}>
        <div className="xl:m-auto">
          <div className="Articles">
            <Articles
              title="Self-Improvement and Mental Health"
              description="Engaging in self-improvement activities can have a positive impact on mental well-being. This includes practices like setting personal goals, developing healthy habits, and seeking support from communities."
              Image={
                img1
              }
              link={"https://www.verywellmind.com/33-reddit-tips-for-better-mental-health-11708495"}
            />
            <Articles
              title="The Impact of Exercise on Mental Health"
              description="Academic environments can significantly influence students' mental health. High expectations and competitive atmospheres may lead to stress and anxiety. Institutions are recognizing this and implementing changes to support student well-being."
              Image={
                img2
              }
              link={"https://www.mayoclinic.org/diseases-conditions/depression/in-depth/depression-and-exercise/art-20046495"}
            />
            <Articles
              title="Mindfulness for Mental Wellness"
              description="Mindfulness involves being present and fully engaged in the current moment without judgment. Practicing mindfulness can reduce stress, enhance emotional regulation, and improve overall mental health."
              Image={
                img3
              }
              link={"https://www.psycom.net/imposter-syndrome"}
            />
            <Articles
              title="The Power of Journaling"
              description="Journaling is a therapeutic practice that involves writing down thoughts and feelings to understand them more clearly. It can help manage anxiety, reduce stress, and cope with depression by providing a safe space for self-expression and reflection.​"
              Image={
                img4
              }
              link={"https://www.psychologytoday.com/us/blog/supersurvivors/202009/the-power-of-journaling"}
            />
          </div>
        </div>
      </section>
      <section id="blogsSection" className="mt-8 pb-8 statsBox">
        <h1 className="text-center text-4xl font-bold mb-8">
          Mental health Issues are Common
        </h1>
        <div className="statsSection">
          <div>
            <img src={piechart} alt="" />
          </div>
          <div className="text-center flex flex-col justify-center gap-4">
            <h2 className="text-2xl">Do You know?</h2>
            <p className="text-lg text-justify">
              Mental health conditions are not uncommon. Hundreds of millions
              suffer from them yearly, and many more do over their lifetimes.
              It’s estimated that 1 in 3 women and 1 in 5 men will experience
              major depression in their lives. Other conditions, such as
              schizophrenia and bipolar disorder, are less common but still have
              a large impact on people’s lives.
            </p>
          </div>
        </div>
      </section>

      

      <footer className="footer">
              <div className="m-auto" style={{ maxWidth: "1320px" }}>
                <div className="text-center">© 2025 by MindMetrics</div>
              </div>
      </footer>

      <button className="scrollButton" onClick={scrollToTop}>
        &#9650;
      </button>
    </div>
  );
}

export default Blogs;