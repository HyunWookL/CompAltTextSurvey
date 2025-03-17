import './App.css';
import React, { useState, useEffect } from 'react';
import StartScreen from './components/StartScreen';
import AnnotateScreen from './components/AnnotateScreen';
import EndScreen from './components/EndScreen';
import InitialScreen from './components/InitialScreen';
import DemoGraphicSurveyScreen from './components/DemoGraphicSurveyScreen';
import TutorialIntroScreen from './components/TutorialIntroScreen';
import TutorialScreen from './components/TutorialScreen';
import QualificationTestScreen from './components/QualificationTestScreen';

function App() {
  // 화면 전환
  const [screen, setScreen] = useState('initial');   // initial, qualification_test, demographic_survey, tutorial_intro, tutorial, start, annotate, end

  // 데모 설문 데이터 (DemoGraphicSurveyScreen에서 입력한 내용)
  const [demoData, setDemoData] = useState(null);

  // 어노테이션 데이터
  const [annotationData, setAnnotationData] = useState([]);

  // 이미지
  const [imagesToAnnotate, setImagesToAnnotate] = useState([]);
  const [imagesForExamples, setImagesForExamples] = useState([]);

  const [isSending, setIsSending] = useState(false);
  const [userId, setUserId] = useState('');

  // 실제 실험용 이미지
  const images = import.meta.glob('/src/assets/images/*.{png,jpg,jpeg,svg}', {
    eager: true,
  });
  // 튜토리얼용 예시 이미지
  const exampleImages = import.meta.glob('/src/assets/examples/*.{png,jpg,jpeg,svg}', {
    eager: true,
  });

  const wholeImages = Object.values(images).map((module) => module.default);

  // 튜토리얼 예시 이미지를 파일명으로 정렬
  const sortedExampleImages = Object.keys(exampleImages)
    .sort()
    .map((key) => exampleImages[key].default);

  const getShuffledImages = (whole) => {
    return [...whole].sort(() => Math.random() - 0.5); // 배열을 무작위로 섞음
  };

  useEffect(() => {
    if (wholeImages.length > 0) {
      setImagesToAnnotate(getShuffledImages(wholeImages)); // 무작위 섞은 이미지 배열 설정
    }
    setImagesForExamples(sortedExampleImages);
  }, []);

  // 구글 Apps Script URL
  const WEB_APP_URL =
    'https://script.google.com/macros/s/AKfycbymVj1oxwNLUbasZQxLDAlS5R_vdc289O2c90sZP9qemRx5tOtEOQHnrYldVP5DcAEVKg/exec';
    //'https://script.google.com/macros/s/AKfycbyN50ItId7fBzUh9o3dmdePHUikxQOlT_qHZJiAKz14uUfpQnHCag0PGtInV65v8ODq/exec';

  // 화면 전환
  const changeScreen = () => {
    window.scrollTo(0, 0);

    if (screen === 'initial') {
      setScreen('qualification_test');
    }
    else if (screen === 'qualification_test') {
      setScreen('demographic_survey');
    } else if (screen === 'demographic_survey') {
      setScreen('tutorial_intro');
    } else if (screen === 'tutorial_intro') {
      setScreen('tutorial');
    } else if (screen === 'tutorial') {
      setScreen('annotate');
    } else if (screen === 'start') {
      setScreen('annotate');
    }
  };

  // 어노테이션 종료 시 구글 시트 전송
  const handleFinish = async (finalData) => {
    setIsSending(true);

    const browserInfo = {
      userAgent: navigator.userAgent,
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
    };

    finalData = {
      demoData,
      browserInfo,
      ...finalData
    };

    const formBody = new URLSearchParams();
    // 실제로는 userId, demoData, annotationData를 각각 따로 append해도 되지만
    // 한 번에 객체 전체를 JSON으로 stringify해서 전송해도 문제없음
    console.log('demoData:', demoData);

    formBody.append('userId', demoData.prolificId);
    formBody.append('annotationData', JSON.stringify(finalData));

    try {
      const response = await fetch(WEB_APP_URL, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
        body: formBody.toString(),
      });

      const result = await response.json();
      console.log('Google Script response:', result);

      setIsSending(false);
      setScreen('end');
    } catch (err) {
      console.error('Error sending data to Google Sheets:', err);
      alert('Failed to send data.');
      setIsSending(false);
    }
  };

  return (
    <div className="app-container">
      {screen === 'initial' && <InitialScreen onStart={changeScreen} />}

      {screen === 'qualification_test' && <QualificationTestScreen onNext={changeScreen} />}

      {screen === 'demographic_survey' && (
        // DemoGraphicSurveyScreen에 setDemoData를 넘겨줌
        <DemoGraphicSurveyScreen
          onNext={changeScreen}
          setDemoData={setDemoData}
        />
      )}

      {screen === 'tutorial_intro' && (
        <TutorialIntroScreen onPracticeStart={changeScreen} />
      )}

      {screen === 'tutorial' && (
        <TutorialScreen
          images={imagesForExamples}
          onTutorialFinish={changeScreen}
        />
      )}

      {screen === 'start' && (
        <StartScreen
          onStart={changeScreen}
          userId={userId}
          setUserId={setUserId}
        />
      )}

      {screen === 'annotate' && (
        <>
          {isSending && (
            <div style={{ textAlign: 'center', margin: '0 auto 20px' }}>
              <p>Sending Data Now...</p>
              <progress />
            </div>
          )}

          {!isSending && (
            <AnnotateScreen
              images={imagesToAnnotate}
              onFinish={handleFinish}
              annotationData={annotationData}
              setAnnotationData={setAnnotationData}
            />
          )}
        </>
      )}

      {screen === 'end' && <EndScreen />}
    </div>
  );
}

export default App;
