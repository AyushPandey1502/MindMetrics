import styles from "./analysis.module.css";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import Markdown from "react-markdown";
import { IoArrowBackSharp, IoChevronForward } from "react-icons/io5";
import { Line } from "react-chartjs-2";
import { CategoryScale } from "chart.js";
import Chart from "chart.js/auto";
import "chartjs-adapter-date-fns";
import LoginContext from "../../context/context";
import { LuLogIn, LuLogOut } from "react-icons/lu";
import { jsPDF } from 'jspdf';


Chart.register(CategoryScale);

function timestampToDate(timestamp) {
  const date = new Date(timestamp);

  const day = ("0" + date.getDate()).slice(-2);
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const year = date.getFullYear();

  const hours = ("0" + date.getHours()).slice(-2);
  const minutes = ("0" + date.getMinutes()).slice(-2);
  const seconds = ("0" + date.getSeconds()).slice(-2);

  const ampm = hours >= 12 ? "PM" : "AM";

  // Convert 24-hour format to 12-hour format
  const formattedHours = hours % 12 || 12;

  return `${day}-${month}-${year} ${formattedHours}:${minutes}:${seconds} ${ampm}`;
}

const scoreMapArr = [
  "Excellent",
  "Very Good",
  "Good",
  "Above Average",
  "Average",
  "Below Average",
  "Fair",
  "Poor",
  "Very Poor",
  "Terrible",
];

scoreMapArr.reverse();

const scoreMapBgcolArr = [
  "#4CAF50", // Green for Excellent (1st)
  "#8BC34A",
  "#FFC107",
  "#FF9800",
  "#FF5722",
  "#F44336",
  "#E91E63",
  "#9C27B0",
  "#673AB7", // Slightly white for Very Poor (9th)
  "#3F51B5", // Slightly white for Terrible (10th)
];

const scoreMapTxtcolArr = [
  "#fff", // White text for Green background
  "#fff", // Black text for Light Green background
  "#fff", // Black text for Amber background
  "#fff", // Black text for Orange background
  "#fff", // White text for Deep Orange background
  "#fff", // White text for Red background
  "#fff", // White text for Pink background
  "#fff", // White text for Purple background
  "#fff", // White text for Deep Purple background
  "#fff", // White text for Indigo background
];

function ScoreChart({ dataset }) {
  // Sample data (replace it with your own data)
  //   const sampleData = [
  //     { timestamp: 1609459200, score: 5 },
  //     { timestamp: 1609545600, score: 7 },
  //     { timestamp: 1609632000, score: 3 },
  //     // Add more data points as needed
  //   ];

  let sampleData = dataset
    .map((rep) => ({
      score: parseInt(rep.score) - 1,
      timestamp: rep.timestamp,
    }))
    ?.reverse();

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Wellness",
        data: [],
        fill: false,
        borderColor: "purple",
        pointBackgroundColor: "black",
        pointBorderColor: "black",
        pointBorderWidth: 2,
        pointHoverBorderWidth: 0,
        borderWidth: 2,
        tension: 0.2,
      },
    ],
  });

  useEffect(() => {
    // Extract timestamps and scores from the sample data
    const timestamps = sampleData.map((data) =>
      new Date(data.timestamp).toLocaleDateString()
    );
    const scores = sampleData.map((data) => data.score);

    setChartData((prevData) => ({
      ...prevData,
      labels: timestamps,
      datasets: [
        {
          ...prevData.datasets[0],
          data: scores,
        },
      ],
    }));
  }, [dataset]);

  const lineOptions = {
    scales: {
      x: {
        display: false,
        title: {
          display: false,
          text: "Timestamp",
        },
        ticks: {
          display: false, // Hide timestamp ticks
        },
        grid: {
          display: false,
        },
      },
      y: {
        type: "linear",
        display: true,
        title: {
          display: false,
          text: "Mental Health",
        },

        max: 10,
        min: 1,
        ticks: {
          stepSize: 1,
          display: true,
        },
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    maintainAspectRatio: false, // Add this line to allow custom height
    responsive: true,
    // aspectRatio: 2, // Set the aspect ratio based on your preference
  };

  return (
    <div style={{ height: "200px", width: "100%" }}>
      <Line data={chartData} options={lineOptions} />
    </div>
  );
}

function LoaderRipple() {
  return (
    <div className={styles["lds-ripple"]}>
      <div></div>
      <div></div>
    </div>
  );
}

function Analysis() {
  const navigate = useNavigate();
  const [curState, setCurState] = useState("loading");
  const [curRep, setCurRep] = useState(null);
  const [analysisHist, setAnalysisHist] = useState([]);
  const [fetchNew, setFetchNew] = useState(false);
  const { logout, loggedIn } = useContext(LoginContext);

  useEffect(() => {
    async function fetchData() {
      const { data } = await axios.get(
        process.env.REACT_APP_API_LINK + "/fetchanalysis",
        {
          withCredentials: true,
        }
      );

      setAnalysisHist(data.data);
      setCurState("list");
      //   console.log(data);
    }
    fetchData();
  }, []);

  async function fetchNewAnalysis() {
    setFetchNew(true);
    try {
      const { data } = await axios.get(
        process.env.REACT_APP_API_LINK + "/analysis",
        {
          withCredentials: true,
        }
      );
      // console.log(data);
      console.log("new analysis");
      // console.log(analysisHist);
      if (data.msg === "nochatdata") {
        setCurState("nochatdata");
      }
      if (data?.data) {
        setAnalysisHist((prev) => {
          let cur = [...prev];
          cur.unshift({ ...data.data, new: true });
          return cur;
        });
      }
    } catch (error) {}

    setFetchNew(false);
  }

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

  const downloadReportAsPDF = () => {
    if (!curRep) return; 
    const doc = new jsPDF();
  
    // Define color scheme
    const primaryColor = [41, 128, 185]; // Blue
    const secondaryColor = [52, 73, 94]; // Dark blue-gray
    const lightGray = [245, 245, 245]; // Background color
    const textColor = [44, 62, 80]; // Main text color

    // Add a colored header
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, 210, 40, "F");

    // Add white header text
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("Mood Analysis Report", 105, 20, { align: "center" });

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    const reportDate = new Date(curRep.timestamp).toLocaleDateString();
    doc.text(`Generated on: ${reportDate}`, 105, 30, { align: "center" });

    // Add main content area with light background
    doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.roundedRect(10, 45, 190, 235, 5, 5, "F");

    // Mental Wellness Score section
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Mental Wellness Score", 20, 55);

    // Score box
    const score = curRep.score;
    const scoreText = `${score} : ${scoreMapArr[score]}`;

    // Create a more visual score indicator
    const scoreX = 20;
    const scoreY = 60;
    const scoreWidth = 150;
    const scoreHeight = 16;

    // Draw score box with rounded corners
    doc.setFillColor(scoreMapBgcolArr[score]);
    doc.roundedRect(scoreX, scoreY, scoreWidth, scoreHeight, 5, 5, "F");

    // Add score text
    doc.setTextColor(scoreMapTxtcolArr[score]);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(scoreText, scoreX + 10, scoreY + 10);

    // Create a visual score representation using circles instead of stars
    const dotY = scoreY + 9;
    const dotSize = 2;
    const dotSpacing = 2;
    let dotX = scoreX + scoreWidth - 50 - (dotSize * 2 * 5) - (dotSpacing * 4);

    // Draw circles for score visualization
    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(0.5);

    for (let i = 1; i <= 10; i++) {
      if (i <= score) {
        doc.setFillColor(255, 255, 255);
        doc.circle(dotX + dotSize, dotY, dotSize, "F");
      } else {
        doc.setFillColor(255, 255, 255, 0);
        doc.circle(dotX + dotSize, dotY, dotSize, "S");
      }
      dotX += dotSize * 2 + dotSpacing;
    }

    // Detailed Analysis Section
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Detailed Analysis", 20, 90);

    // Add section divider
    doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setLineWidth(1);
    doc.line(20, 93, 190, 93);

    // Format and add analysis text
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);

    const analysisText = curRep.analysis || "No analysis available.";

    // Remove markdown-like bold formatting
    const formattedText = analysisText.replace(/\*\*([^*]+)\*\*/g, "$1");

    // Identify sections with "Header: Content" pattern
    const sectionPattern = /([A-Za-z ]+):\s/g;
    let match;
    let sections = [];
    let lastIndex = 0;

    while ((match = sectionPattern.exec(formattedText)) !== null) {
      if (match.index > lastIndex) {
        sections.push({
          isHeader: false,
          text: formattedText.substring(lastIndex, match.index).trim()
        });
      }

      sections.push({
        isHeader: true,
        text: match[1].trim()
      });

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text if any
    if (lastIndex < formattedText.length) {
      sections.push({
        isHeader: false,
        text: formattedText.substring(lastIndex).trim()
      });
    }

    // If no sections detected, use full text
    if (sections.length === 0) {
      sections = [{ isHeader: false, text: formattedText }];
    }

    let yPosition = 100;
    const lineHeight = 6;
    // const pageHeight = 297;  // A4 height in mm
    const marginBottom = 20;

    // Function to handle page overflow before writing new content
    const handleOverflow = (lineCount = 1) => {
      if (yPosition + lineCount * lineHeight > pageHeight - marginBottom) {
        doc.addPage();
        yPosition = 15;
      }
    };

    // Loop through each section to print headers and content correctly
    const pageHeight = doc.internal.pageSize.height; // Get total page height
    const bottomMargin = 20; // Space to leave at bottom

    sections.slice(3, -2).forEach((section, index) => {
        if (section.isHeader) {
            handleOverflow(); // Ensure enough space before adding header
            doc.setFont("helvetica", "bold");
            doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);

            let nextSection = sections[index + 1];
            if (nextSection && !nextSection.isHeader) {
                // Merge header and first content line
                let combinedText = `${section.text}: ${nextSection.text}`;
                const contentLines = doc.splitTextToSize(combinedText, 170);

                handleOverflow(contentLines.length);
                doc.text(contentLines, 20, yPosition);
                yPosition += contentLines.length * lineHeight;

                // Mark the next section as processed
                nextSection.processed = true;
            } else {
                // Print standalone header
                doc.text(section.text + ":", 20, yPosition);
                yPosition += lineHeight + 2;
            }
        } else if (section.text && !section.processed) {
            doc.setFont("helvetica", "normal");
            doc.setTextColor(60, 60, 60);

            const contentLines = doc.splitTextToSize(section.text, 170);
            let requiredSpace = contentLines.length * lineHeight;

            // Check if content fits on current page; if not, create a new page
            if (yPosition + requiredSpace > pageHeight - bottomMargin) {
                doc.addPage();
                yPosition = 30; // Reset y-position for new page
            }

            doc.text(contentLines, 20, yPosition);
            yPosition += requiredSpace;
        }
    });

      
      
      

    


    // Key Themes Section with visual tags
    const themesY = Math.min(yPosition + 15, 220); // Cap position to avoid overflow

    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Key Themes Identified", 20, themesY);

    // Add section divider
    doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setLineWidth(1);
    doc.line(20, themesY + 3, 190, themesY + 3);

    // Draw keyword tags with nicer styling
    let tagX = 20;
    let tagY = themesY + 15;
    const tagMaxWidth = 180;
    const tagHeight = 12;

    if (curRep.keywords && curRep.keywords.length > 0) {
      curRep.keywords.forEach(keyword => {
          const tagWidth = (doc.getStringUnitWidth(keyword) * 10 / doc.internal.scaleFactor) + 14;
  
          // Check if the keyword fits in the current line; if not, reset x and move to a new line
          if (tagX + tagWidth > tagMaxWidth) {
              tagX = 20; // Reset X position to start a new line
              tagY += tagHeight + 4; // Move to next line
              handleOverflow();
          }
  
          // Draw the tag background
          doc.setFillColor(
              primaryColor[0] + (255 - primaryColor[0]) * 0.8,
              primaryColor[1] + (255 - primaryColor[1]) * 0.8,
              primaryColor[2] + (255 - primaryColor[2]) * 0.8
          );
          doc.roundedRect(tagX, tagY - 8, tagWidth, 10, 5, 5, "F");
  
          // Draw the tag border
          doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
          doc.setLineWidth(0.5);
          doc.roundedRect(tagX, tagY - 8, tagWidth, 10, 5, 5, "S");
  
          // Add the keyword text inside the tag
          doc.setFontSize(10);
          doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
          doc.setFont("helvetica", "bold");
          doc.text(keyword, tagX + 7, tagY - 2);
  
          // Move X position for the next tag
          tagX += tagWidth + 3;
      });
  }
  

    // Footer with logo and page number
    doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.rect(0, 280, 210, 17, "F");

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text("MindMetrics - Your mental health companion", 105, 288, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.text(`Page ${doc.internal.getNumberOfPages()}`, 190, 288, { align: "right" });

    // Save the PDF with meaningful filename
    const filename = `MindMetrics_Report_${reportDate.replace(/\//g, '-')}.pdf`;
    doc.save(filename);
};

  return (
    <div className={styles.analysisContainer}>
      <header>
        <div className={styles.logoContainer} onClick={()=>{
          navigate('/')
        }}>
        </div>

        <div className="flex flex-row gap-4">
          {loggedIn && (
            <button
              onClick={() => {
                navigate("/message");
              }}
            >
              Chat
            </button>
          )}
          <button
            onClick={() => {
              if (!loggedIn) navigate("/login");
              else {
                logoutUser();
              }
            }}
          >
            {!loggedIn ? <LuLogIn /> : <LuLogOut />}
          </button>
        </div>
      </header>

      <main style={{ minHeight: "100vh" }}>
        <section className={styles.chartCont}>
          <ScoreChart dataset={analysisHist} />
          <h2>How you're doing mentally</h2>
        </section>

        <section className={styles.butCont}>
          <button
            onClick={fetchNewAnalysis}
            disabled={fetchNew}
            className={styles.fetchNewBut}
          >
          Analyse Now
          </button>

          {curRep && (
            <button

              onClick={downloadReportAsPDF}
              className={styles.fetchNewBut}
            >
              Download Report
            </button>
          )}

          {curState === "details" && (
            <button
              onClick={() => {
                setCurState("list");
                setCurRep(null);
              }}
              className={styles.backBut}
            >
              <IoArrowBackSharp />
            </button>
          )}
        </section>

        <section>
          {curState === "loading" && (
            <div style={{ textAlign: "center" }}>
              <LoaderRipple />
            </div>
          )}
          {curState === "nochatdata" && (
            <div style={{ textAlign: "center" }}>
              No Chat History Data!
              <br />
              Chat with us before analysing.
            </div>
          )}
          {curState === "list" && analysisHist.length === 0 && (
            <div style={{ textAlign: "center" }}>
              No Previous Report!
              <br />
              Click "New Analysis" to generate one.
            </div>
          )}
          {curState === "list" && analysisHist.length > 0 && (
            <div className={styles.analList}>
              {analysisHist.map((rep, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setCurRep(analysisHist[i]);
                    setCurState("details");
                  }}
                  className={`${styles.analItem} ${
                    analysisHist[i]?.new ? styles.newAnalItem : ""
                  }`}
                >
                  <span></span>
                  <span>{timestampToDate(rep.timestamp)}</span>
                  <span>
                    <IoChevronForward />
                  </span>
                </div>
              ))}
            </div>
          )}
          {curState === "details" && (
            <div className={styles.analDetails} key={curRep?.timestamp}>
              <div className={styles.analDetailsTop}>
                <div
                  className={styles.analDetailsScore}
                  style={{
                    backgroundColor: scoreMapBgcolArr[curRep.score],
                    color: scoreMapTxtcolArr[curRep.score],
                  }}
                >
                  {curRep?.score}
                  {" : "}
                  {curRep?.score && scoreMapArr[curRep.score]}
                </div>
                <div className={styles.analDetailsTimestamp}>
                  {timestampToDate(curRep?.timestamp)}
                </div>
              </div>
              <div className={styles.analDetailsReport}>
                <Markdown>{curRep?.analysis}</Markdown>
              </div>
              <div className={styles.analDetailsKeywords}>
                {curRep?.keywords.map((kw) => (
                  <span key={kw}>{kw}</span>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Analysis;
