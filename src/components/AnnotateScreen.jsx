import React, { useState, useRef, useEffect } from 'react';
import json_list from '../assets/descriptions.json';

function AnnotateScreen({
  images,
  onFinish,
  annotationData,
  setAnnotationData,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [tempBox, setTempBox] = useState(null);
  const [textInput, setTextInput] = useState('');
  const [MainFormData, setMainFormData] = useState({
      salient: "",
      statistic: "",
      diverse: "",
      salientText: "",
      statisticText: "",
      diverseText: ""
  });
  const handleChange = (e) => {
      const {name, value} = e.target;
      setMainFormData((prev) => ({...prev, [name]: value}));
  };
  const [phase, setPhase] = useState('Phase1');
  // 이미지 높이를 동적으로 조절하기 위한 상태
  const [imgHeight, setImgHeight] = useState(380);
  const [imgSize, setImgSize] = useState({ width: 'auto', height: 'auto' });

  const containerRef = useRef(null);
  const imgRef = useRef(null);

  // ─────────────────────────────────────────────────────────────────────────────
  // ① 이미지가 바뀔 때마다 image_up_timestamp 설정
  //    (이미 처리된 이미지라면 중복 설정하지 않음)
  // ─────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!images || !images[currentIndex]) return;

    const currentImgSrc = images[currentIndex];
    const now = Date.now();

    setAnnotationData((prev) => {
      const exist = prev.find((anno) => anno.imgSrc === currentImgSrc);

      // 이미 이 이미지에 대한 정보가 있고, image_up_timestamp가 없다면 추가
      if (exist && !exist.image_up_timestamp) {
        return prev.map((anno) => {
          if (anno.imgSrc === currentImgSrc) {
            return { ...anno, image_up_timestamp: now };
          }
          return anno;
        });
      }
      // 아직 등록된 정보가 없다면 새로 push
      else if (!exist) {
        return [
          ...prev,
          {
            imgSrc: currentImgSrc,
            boxes: [],
            text: '',
	    score: {},
            image_up_timestamp: now,
          },
        ];
      }

      // 이미 exist가 있고, image_up_timestamp도 있다면 그대로
      return prev;
    });
  }, [currentIndex, images, setAnnotationData]);

  // ─────────────────────────────────────────────────────────────────────────────
  // ② 이미지 로딩 후 실제 높이를 가져와서 텍스트에어리어의 높이를 동기화
  // ─────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (imgRef.current) {
      setImgHeight(imgRef.current.naturalHeight);
    }
  }, [currentIndex]);

  // 마우스 드래그 시작
  const handleMouseDown = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setIsDrawing(true);
    setStartPoint({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  // 드래그 중 박스 영역 설정
  const handleMouseMove = (e) => {
    if (!isDrawing || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();

    setTempBox({
      left: Math.min(startPoint.x, e.clientX - rect.left),
      top: Math.min(startPoint.y, e.clientY - rect.top),
      width: Math.abs(e.clientX - rect.left - startPoint.x),
      height: Math.abs(e.clientY - rect.top - startPoint.y),
    });
  };

  // 드래그 끝 (박스 그리기 완료)
  const handleMouseUp = () => {
    if (!isDrawing || !tempBox || !containerRef.current) return;
    setIsDrawing(false);

    const currentImgSrc = images[currentIndex];
    const now = Date.now(); // box_drawn_timestamp

    const newBox = {
      x: tempBox.left,
      y: tempBox.top,
      w: tempBox.width,
      h: tempBox.height,
    };

    setAnnotationData((prev) => {
      const exist = prev.find((anno) => anno.imgSrc === currentImgSrc);
      if (exist) {
        // 기존 데이터가 있으면 해당 이미지에 박스 및 box_drawn_timestamp 추가
        return prev.map((anno) => {
          if (anno.imgSrc === currentImgSrc) {
            return {
              ...anno,
              boxes: [newBox], // 예시: 박스 한 개만 유지
              box_drawn_timestamp: now,
            };
          }
          return anno;
        });
      } else {
        // 없으면 새로 생성
        return [
          ...prev,
          {
            imgSrc: currentImgSrc,
            boxes: [newBox],
            text: '',
	    score: {},
            box_drawn_timestamp: now,
          },
        ];
      }
    });

    setTempBox(null);
  };




  // ─────────────────────────────────────────────────────────────────────────────
  // ③ changeScreen과 동일 -- button 기반으로 Phase 바꿔주기
  // ─────────────────────────────────────────────────────────────────────────────
  const changePhase = () => {
  	if (phase === 'Phase1') {
  	  setPhase('Phase2');
  	} else if (phase === 'Phase2') {
  	  setPhase('Phase3');
  	} else if (phase === 'Phase3') {
  	  setPhase('Phase4');
  	} else if (phase === 'Phase4') {
  	  setPhase('Phase1')
  	}
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // ③ Next 버튼 눌렀을 때 next_button_timestamp 저장 + text 내용 반영
  // ─────────────────────────────────────────────────────────────────────────────
  const handleNextImage = () => {
    window.scrollTo(0, 0);
    const currentImgSrc = images[currentIndex];
    const now = Date.now(); // next_button_timestamp

    // annotationData 업데이트
    const newAnnotationData = (() => {
      const cloned = [...annotationData];
      const index = cloned.findIndex((anno) => anno.imgSrc === currentImgSrc);

      if (index !== -1) {
        cloned[index] = {
          ...cloned[index],
          text: textInput,
	  score: MainFormData,
          next_button_timestamp: now,
        };
      } else {
        // 혹시라도 이미지 데이터가 없었다면 새로 추가
        cloned.push({
          imgSrc: currentImgSrc,
          boxes: [],
          text: textInput,
	  score: MainFormData,
          next_button_timestamp: now,
        });
      }
      return cloned;
    })();

    setAnnotationData(newAnnotationData);
    setTextInput('');
    setMainFormData({
      salient: "",
      statistic: "",
      diverse: "",
      salientText: "",
      statisticText: "",
      diverseText: ""
    });
    setPhase('Phase1');

    // 마지막 이미지인지 체크
    if (currentIndex === images.length - 1) {
      // 마지막이면 onFinish에 최신 데이터 넘겨주기
      onFinish(newAnnotationData);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  // 현재 이미지 & 이미 드로잉된 박스
  const currentImgSrc = images[currentIndex];
  const currentAnno = annotationData.find((anno) => anno.imgSrc === currentImgSrc);
  const existingBoxes = currentAnno?.boxes || [];

  const current_descs = json_list.find((data) => data.id === currentImgSrc.split("/").at(-1).substring(0,3));
  const DescTrad = current_descs.trad;
  const DescOurs = current_descs.ours;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column', // 세로로 나열
        alignItems: 'center',    // 가운데 정렬
        textAlign: 'center',
        marginTop: '30px',
        fontFamily: 'Arial, sans-serif',
        lineHeight: '1.6',
        color: '#555',
        height: 'auto',
        justifyContent: 'center'
      }}
    >
      {/* 상단 텍스트 영역 (이미지 바로 위) */}
      <div
        style={{
          textAlign: 'left',
          marginBottom: '10px',
          maxWidth: '600px', // 필요에 따라 조절
          width: '100%',
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
        }}
      >
        {/* <p style={{ margin: 0, fontWeight: 'bold' }}>Training Session</p> */}
        <div style={{ margin: 0, fontWeight: 'bold' }}>
	  {phase === "Phase1" && <p>Brush the most prominent region in the chart (Phase: 1 / 4, Chart: {currentIndex + 1} / {images.length})</p>}
	  {phase === "Phase2" && <p>Based on charts and descriptions, answers the questions below (Phase: 2 / 4, Chart: {currentIndex + 1} / {images.length})</p>}
	  {phase === "Phase3" && <p>Based on charts and descriptions, answers the questions below (Phase: 3 / 4, Chart: {currentIndex + 1} / {images.length})</p>}
	  {phase === "Phase4" && <p>Based on charts and descriptions, answers the questions below (Phase: 4 / 4, Chart: {currentIndex + 1} / {images.length})</p>}
	</div>
      </div>

      {/* 이미지 영역 */}
      <div
        ref={containerRef}
        style={{
          position: 'relative',
          cursor: 'crosshair',
          marginBottom: '20px',
          // maxWidth: '600px', // 필요에 따라 조절
          // width: '100%',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <img
          ref={imgRef}
          src={currentImgSrc}
          //alt={`img-${currentIndex}`}
          style={{
            width: imgSize.width,
            height: imgSize.height,
            userSelect: 'none',
            pointerEvents: 'none',
            border: "1px solid black", borderRadius: "8px" 
          }}
          onLoad={(e) => setImgSize({
            width: e.target.naturalWidth,
            height: e.target.naturalHeight,
          })}
          onContextMenu={(e) => e.preventDefault()}
          onDragStart={(e) => e.preventDefault()}
        />

        {/* 이미 그린 박스 표시 */}
        {existingBoxes.map((box, idx) => (
          <div
            key={idx}
            style={{
              position: 'absolute',
              border: '2px solid red',
              left: box.x,
              top: box.y,
              width: box.w,
              height: box.h,
            }}
          />
        ))}

        {/* 드래그 중 임시 박스 표시 */}
        {isDrawing && tempBox && (
          <div
            style={{
              position: 'absolute',
              border: '2px dashed blue',
              left: tempBox.left,
              top: tempBox.top,
              width: tempBox.width,
              height: tempBox.height,
            }}
          />
        )}
      </div>

      {/* 이미지 캡션 추가 */}
      <div
        style = {{
          display: phase === 'Phase1' ? 'none' : 'flex',
	  textAlign: 'left',
          width: '1000px',
          margineBottom: '20px',
        }}
      >
	    <div style = {{
	      flex: "50%",
	      padding: "10px",
	      }}
	    >
	      <p><b>Description A</b></p>
	      <p>{DescTrad}</p>
	    </div>
	    <div style = {{
	      flex: "50%",
	      padding: "10px",
	    }}>
	      <p><b>Description B</b></p>
	  	  <p>{DescOurs}</p>
		</div>
      </div>

      {/* 텍스트 입력 영역 */}
      {phase === 'Phase1' && <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          // maxWidth: '600px', // 필요에 따라 조절
          // width: '100%',
          textAlign: 'left',
          marginBottom: '20px',
        }}
      >
        <label
          htmlFor="description"
          style={{
            marginBottom: '6px',
            fontWeight: 'bold',
            fontSize: '14px',
          }}
        >
          What characteristic(s) of this region made you select it as the most prominent?
        </label>
        <textarea
          id="description"
          style={{
            width: imgSize.width, // 이미지 너비에 맞춤
            height: '100px', // 고정 높이 (필요 시 조절 또는 동적 계산)
            fontSize: '14px',
            padding: '8px',
            resize: 'none',
            boxSizing: 'border-box',
            alignSelf: 'center',
          }}
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
        />
      </div>}

      {/* Salient/Statistical/Diverse 입력창 */}
      {phase === 'Phase2' && <div id="Phase2" style={{ marginTop: "20px", color: "#555" }}>
		<p>a. Which one provide <b>more salient information</b> for the visualization?</p>
		<div style={{ marginLeft: "20px" }}>
      	  <div style={{ display: "flex", justifyContent: "space-around", width: imgSize.width, marginTop: "10px"}}>
	  		{['A', 'B'].map((num) => (
	      	  <label key={num} style={{ textAlign: "center" }}>
		    	<input
		      	  type="radio"
  		      	  name="salient"
		      	  value={num}
		      	  checked={MainFormData.salient === String(num)}
		      	  onChange={handleChange}
		      	  style={{ display: "block", margin: "0 auto" }}
		    	/>
		    	{num}
	      	  </label>
	    	))}
	  	  </div>
		</div>
	<div
        style={{
          display: 'flex',
          flexDirection: 'column',
          // maxWidth: '600px', // 필요에 따라 조절
          // width: '100%',
          textAlign: 'left',
          marginBottom: '20px',
        }}
        >

        <label
          htmlFor="description"
          style={{
            marginBottom: '6px',
            fontWeight: 'bold',
            fontSize: '14px',
          }}
        >
          Why do you think that description provide <span style={{textDecoration:"underline"}}>more salient information</span>?
        </label>
        <textarea
          id="descriptionSal"
          style={{
            width: imgSize.width, // 이미지 너비에 맞춤
            height: '100px', // 고정 높이 (필요 시 조절 또는 동적 계산)
            fontSize: '14px',
            padding: '8px',
            resize: 'none',
            boxSizing: 'border-box',
            alignSelf: 'center',
          }}
	  name="salientText"
          onChange={handleChange}
        />
	</div>
      </div>}

      {phase === 'Phase3' && <div id="Phase3" style={{ marginTop: "20px", color: "#555" }}>
        <p>b. Which one provide <b>more diverse information</b> for the visualization?</p>
        <div style={{ marginLeft: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-around", width: imgSize.width, marginTop: "10px", textAlign: 'center'}}>
            {['A', 'B'].map((num) => (
              <label key={num} style={{ textAlign: "center" }}>
                <input
                  type="radio"
                  name="diverse"
                  value={num}
                  checked={MainFormData.diverse === String(num)}
                  onChange={handleChange}
                  style={{ display: "block", margin: "0 auto" }}
                />
                {num}
              </label>
            ))}
          </div>
        </div>
	<div
        style={{
          display: 'flex',
          flexDirection: 'column',
          // maxWidth: '600px', // 필요에 따라 조절
          // width: '100%',
          textAlign: 'left',
          marginBottom: '20px',
        }}
        >

        <label
          htmlFor="description"
          style={{
            marginBottom: '6px',
            fontWeight: 'bold',
            fontSize: '14px',
          }}
        >
          Why do you think that description provide <span style={{textDecoration:"underline"}}>more diverse information</span>?
        </label>
        <textarea
          id="descriptionDiv"
          style={{
            width: imgSize.width, // 이미지 너비에 맞춤
            height: '100px', // 고정 높이 (필요 시 조절 또는 동적 계산)
            fontSize: '14px',
            padding: '8px',
            resize: 'none',
            boxSizing: 'border-box',
            alignSelf: 'center',
          }}
          name="diverseText"
          onChange={handleChange}
        />
	</div>
      </div>}

      {phase === 'Phase4' && <div id="Phase4" style={{ marginTop: "20px", color: "#555" }}>
        <p>c. Which one provide <b>more statistical information</b> for the visualization?</p>
        <div style={{ marginLeft: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-around", width: imgSize.width, marginTop: "10px", textAlign: 'center'}}>
            {['A', 'B'].map((num) => (
              <label key={num} style={{ textAlign: "center" }}>
                <input
                  type="radio"
                  name="statistic"
                  value={num}
                  checked={MainFormData.statistic === String(num)}
                  onChange={handleChange}
                  style={{ display: "block", margin: "0 auto" }}
                />
                {num}
              </label>
            ))}
          </div>
        </div>
	<div
        style={{
          display: 'flex',
          flexDirection: 'column',
          // maxWidth: '600px', // 필요에 따라 조절
          // width: '100%',
          textAlign: 'left',
          marginBottom: '20px',
        }}
        >

        <label
          htmlFor="description"
          style={{
            marginBottom: '6px',
            fontWeight: 'bold',
            fontSize: '14px',
          }}
        >
          Why do you think that description provide <span style={{textDecoration:"underline"}}>more statistical information</span>?
        </label>
        <textarea
          id="descriptionStat"
          style={{
            width: imgSize.width, // 이미지 너비에 맞춤
            height: '100px', // 고정 높이 (필요 시 조절 또는 동적 계산)
            fontSize: '14px',
            padding: '8px',
            resize: 'none',
            boxSizing: 'border-box',
            alignSelf: 'center',
          }}
          name="statisticText"
          onChange={handleChange}
        />
	</div>
      </div>}

      {/* Phase Next Button */}
      <button
        style={{
          display: phase === 'Phase4' ? 'none' : 'flex',
          marginBottom: '30px',
          padding: '12px 24px',
          fontSize: '16px', // 마지막 버튼 크기 증가
          fontWeight: 'bold',
          backgroundColor: '#6c757d', // Finish: 초록색, Next: 회색
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: (phase === 'Phase1' && (existingBoxes.length !== 1 || textInput === '')) || (phase === 'Phase2' && (MainFormData.salient === '' || MainFormData.salientText === '')) || (phase === 'Phase3' && (MainFormData.diverse === '' || MainFormData.diverseText === '')) || (phase === 'Phase4' && (MainFormData.statistic === '' || MainFormData.statisticText === '')) ? 'not-allowed' : 'pointer',
          opacity: (phase === 'Phase1' && (existingBoxes.length !== 1 || textInput === '')) || (phase === 'Phase2' && (MainFormData.salient === '' || MainFormData.salientText === '')) || (phase === 'Phase3' && (MainFormData.diverse === '' || MainFormData.diverseText === '')) || (phase === 'Phase4' && (MainFormData.statistic === '' || MainFormData.statisticText === '')) ? 0.5 : 1, // 비활성화 시 흐리게 표시
          transition: 'background-color 0.3s ease, transform 0.2s ease',
        }}
        onClick={changePhase}
        disabled={(phase === 'Phase1' && (existingBoxes.length !== 1 || textInput === '')) || (phase === 'Phase2' && (MainFormData.salient === '' || MainFormData.salientText === '')) || (phase === 'Phase3' && (MainFormData.diverse === '' || MainFormData.diverseText === '')) || (phase === 'Phase4' && (MainFormData.statistic === '' || MainFormData.statisticText === ''))}
        onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#5a6268'; // Next 버튼: 진한 회색
        }}
        onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#6c757d'; // Next 버튼: 원래 회색
        }}
      >
        {'Next Questions'}
      </button>

      {/* Next / Finish 버튼 */}
      <button
        style={{
	  display: phase === 'Phase4' ? 'flex' : 'none',
          marginBottom: '30px',
          padding: '12px 24px',
          fontSize: currentIndex === images.length - 1 ? '18px' : '16px', // 마지막 버튼 크기 증가
          fontWeight: 'bold',
          backgroundColor: currentIndex === images.length - 1 ? '#28a745' : '#6c757d', // Finish: 초록색, Next: 회색
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: (phase === 'Phase4' && (MainFormData.statistic === '' || MainFormData.statisticText === '')) ? 'not-allowed' : 'pointer',
          opacity: (phase === 'Phase4' && (MainFormData.statistic === '' || MainFormData.statisticText === '')) ? 0.5 : 1, // 비활성화 시 흐리게 표시
          transition: 'background-color 0.3s ease, transform 0.2s ease',
        }}
        onClick={handleNextImage}
        disabled={phase === 'Phase4' && (MainFormData.statistic === '' || MainFormData.statisticText === '')}
        onMouseEnter={(e) => {
          if (currentIndex === images.length - 1) {
            e.target.style.backgroundColor = '#218838'; // Finish 버튼: 진한 초록색
          } else {
            e.target.style.backgroundColor = '#5a6268'; // Next 버튼: 진한 회색
          }
        }}
        onMouseLeave={(e) => {
          if (currentIndex === images.length - 1) {
            e.target.style.backgroundColor = '#28a745'; // Finish 버튼: 원래 초록색
          } else {
            e.target.style.backgroundColor = '#6c757d'; // Next 버튼: 원래 회색
          }
        }}
      >
        {currentIndex === images.length - 1 ? 'Finish The Survey' : 'Go To Next Image'}
      </button>
    </div>
  );
}

export default AnnotateScreen;

