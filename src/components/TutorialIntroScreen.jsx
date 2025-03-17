import React from 'react';
import guideGif from '/src/assets/guide.gif';


function TutorialIntroScreen({ onPracticeStart }) {
    return (
        <div
            style={{
                maxWidth: '800px',
                height: '100%',
                marginTop: '30px',
                fontFamily: 'Arial, sans-serif',
                lineHeight: '1.6',
                color: '#555',
                textAlign: 'left',
            }}
        >
            <h2 style={{ textAlign: 'left', color: '#333', borderBottom: '2px solid #ddd', paddingBottom: '10px' }}>
                Tutorial
            </h2>

            <div style={{ marginTop: '20px' }}>
	    	<p>
	            In this experiment, you will view the charts and corresponding two descriptions, select the more informative descriptions 
	            based on specfic aspect provided in questions. You will also select the most prominent region of the chart by drawing a 
	            bounding box, and describe your selection. You may leave the comments about the descriptions as well.
	        </p>
            </div>

            <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
                <img
                    src={guideGif}
                    alt="Chart Example"
                    style={{ width: "60%" }}
                />
            </div>



            {/* For Bar Charts */}
            {/* <h3 style={{ color: '#333', marginTop: '20px' }}>For Bar Charts 📊:</h3>
            <div style={{ marginLeft: '20px', marginTop: '10px' }}>
                <p>
                    <strong>Title Format:</strong>
                </p>
                <p>📌 "[What is measured] by [Grouping category] ([Timeframe], in [Unit])"</p>
                <p>
                    <em>Example:</em> Unemployment rate by country (2023, in percentage)
                </p>
                <p>
                    <strong>How to read:</strong>
                </p>
                <ul>
                    <li>The y-axis shows the unemployment rate (what is measured).</li>
                    <li>The x-axis shows countries (how the data is grouped).</li>
                    <li>The data is from 2023 and measured in percentage.</li>
                </ul>
                <p>
                    <strong>Tip:</strong> If the bars are horizontal, swap the x and y axes when interpreting.
                </p>
            </div> */}

            {/* For Line Charts */}
            {/* <h3 style={{ color: '#333', marginTop: '20px' }}>For Line Charts 📈:</h3>
            <div style={{ marginLeft: '20px', marginTop: '10px' }}>
                <p>
                    <strong>Title Format:</strong>
                </p>
                <p>📌 "[What is measured] by [Time category] (in [Unit])"</p>
                <p>
                    <em>Example:</em> Stock market volatility by days since election (in index points)
                </p>
                <p>
                    <strong>How to read:</strong>
                </p>
                <ul>
                    <li>The y-axis shows stock market volatility (what is measured).</li>
                    <li>The x-axis tracks days since the election (time category).</li>
                    <li>The unit is index points.</li>
                </ul>
                <p>
                    <strong>Tip:</strong> The x-axis labels determine the time category.
                </p>
            </div> */}

            {/* How to Draw a Bounding Box */}
            <h3 style={{ color: '#333', marginTop: '20px' }}>How to Draw a Bounding Box:</h3>
            <div style={{
                // marginLeft: '10px', 
                marginTop: '10px'
            }}>
                <ul>
                    <li>Click and drag your mouse to draw a box around the region that stands out most to you.</li>
                    <li>You must draw the box and provide the description to proceed to the next graph.</li>
                    <li>If you make a mistake, simply redraw the box—it will overwrite the previous one.</li>
                    <li>Once you’re ready, click Start to begin practice.</li>
                </ul>
            </div>

            <div style={{ textAlign: 'center', marginTop: '30px', marginBottom: '50px', paddingBottom: '50px' }}>
                <button onClick={onPracticeStart}>
                    Start Practicing
                </button>
            </div>
        </div>
    );
}

export default TutorialIntroScreen;
