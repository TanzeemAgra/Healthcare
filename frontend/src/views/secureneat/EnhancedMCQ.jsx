import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Badge, Alert, ProgressBar, Modal, Row, Col, Form, Tab, Nav, Spinner } from 'react-bootstrap';
import { 
  RiQuestionLine, 
  RiCheckLine, 
  RiArrowLeftLine, 
  RiArrowRightLine,
  RiBookOpenLine,
  RiRobotLine,
  RiSettingsLine,
  RiUploadLine,
  RiFileTextLine,
  RiDeleteBinLine,
  RiEyeLine,
  RiDownloadLine,
  RiDatabase2Line
} from 'react-icons/ri';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import S3LibraryBrowser from './S3LibraryBrowser';
import apiClient from '../../services/api';

const EnhancedSecureNeatMCQ = () => {
  // Refs
  const reportContentRef = useRef(null);
  
  // Core state
  const [activeTab, setActiveTab] = useState('practice');
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [showAnswerFeedback, setShowAnswerFeedback] = useState({});
  const [immediateFeedbackEnabled, setImmediateFeedbackEnabled] = useState(true);
  
  // Modal states
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  
  // Practice mode settings
  const [practiceSettings, setPracticeSettings] = useState({
    category: 'General Medicine',
    numberOfQuestions: 10,
    difficulty: 'Mixed',
    timeLimit: 0
  });
  
  // AI Book mode settings
  const [aiSettings, setAiSettings] = useState({
    chapterMode: 'consolidated',
    numberOfQuestions: 10,
    timeLimit: 30,
    difficulty: 'Mixed'
  });
  
  // File upload state
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // Sample questions for practice mode
  const [questions, setQuestions] = useState([
    {
      question: "What is the most common cause of myocardial infarction?",
      options: [
        "Coronary artery thrombosis",
        "Coronary artery spasm",
        "Coronary artery embolism",
        "Aortic stenosis"
      ],
      correct: 0,
      category: "Cardiology",
      explanation: "Coronary artery thrombosis due to atherosclerotic plaque rupture is the most common cause of myocardial infarction (MI), accounting for approximately 90% of all cases. This process begins with the formation of atherosclerotic plaques in the coronary arteries over many years. These plaques consist of lipid cores covered by fibrous caps. When a plaque becomes unstable, it can rupture, exposing the highly thrombogenic lipid core to circulating blood. This triggers the coagulation cascade, leading to rapid thrombus formation that can completely or partially occlude the coronary artery. The resulting reduction in blood flow causes myocardial ischemia and, if prolonged, leads to myocardial cell death (infarction). The location and extent of the MI depend on which coronary artery is affected and the presence of collateral circulation. ST-elevation myocardial infarction (STEMI) typically results from complete occlusion, while non-ST-elevation myocardial infarction (NSTEMI) often involves partial occlusion. Understanding this pathophysiology is crucial for recognizing the importance of early intervention with thrombolytics, antiplatelet agents, or percutaneous coronary intervention to restore blood flow and minimize myocardial damage. Risk factors that contribute to plaque formation and rupture include hypertension, diabetes, smoking, hyperlipidemia, and family history of coronary artery disease.",
      studyTips: [
        "Review atherosclerosis pathophysiology",
        "Study coronary artery anatomy",
        "Practice ECG interpretation for STEMI/NSTEMI",
        "Learn about cardiac biomarkers"
      ]
    },
    {
      question: "Which of the following is a sign of increased intracranial pressure?",
      options: [
        "Bradycardia and hypertension",
        "Tachycardia and hypotension",
        "Normal vital signs",
        "Fever and leukocytosis"
      ],
      correct: 0,
      category: "Neurology",
      explanation: "Cushing's triad, consisting of bradycardia, hypertension, and irregular breathing patterns, is the classic sign of increased intracranial pressure (ICP). This triad represents the body's compensatory mechanism to maintain cerebral perfusion pressure when ICP rises dangerously. The pathophysiology involves the brain's attempt to maintain adequate blood flow despite increased pressure within the rigid skull. As ICP increases, it compresses blood vessels and reduces cerebral blood flow. The body responds by increasing systemic blood pressure (hypertension) to overcome the increased resistance and maintain cerebral perfusion. This hypertension is detected by baroreceptors, which normally would cause tachycardia, but the increased ICP directly compresses the brainstem, specifically affecting the medulla oblongata where cardiovascular and respiratory centers are located. This brainstem compression results in bradycardia and irregular breathing patterns (such as Cheyne-Stokes respiration or central neurogenic hyperventilation). Cushing's triad is a late and ominous sign indicating imminent brain herniation and potential death if not immediately addressed. Early signs of increased ICP include headache, nausea, vomiting, altered mental status, and papilledema. Management requires immediate intervention to reduce ICP through measures such as elevating the head of the bed, hyperventilation, osmotic diuretics (mannitol), or surgical decompression. Healthcare providers must recognize that Cushing's triad indicates a neurological emergency requiring immediate aggressive treatment.",
      studyTips: [
        "Memorize Cushing's triad components",
        "Study brain anatomy and CSF circulation",
        "Review causes of increased ICP",
        "Learn about neurological examination"
      ]
    },
    {
      question: "What is the first-line treatment for acute anaphylaxis?",
      options: [
        "Corticosteroids",
        "Epinephrine",
        "Antihistamines",
        "Bronchodilators"
      ],
      correct: 1,
      category: "Emergency Medicine",
      explanation: "Epinephrine is the first-line treatment for anaphylaxis due to its rapid onset and comprehensive physiological effects that counteract the life-threatening manifestations of this severe allergic reaction. Anaphylaxis is a systemic, IgE-mediated hypersensitivity reaction that can cause cardiovascular collapse, severe bronchospasm, and massive vasodilation within minutes of exposure to an allergen. Epinephrine works through both alpha and beta-adrenergic receptors to provide multiple beneficial effects: Alpha-1 receptor stimulation causes vasoconstriction, which increases blood pressure and counteracts the dangerous hypotension and shock associated with anaphylaxis. Beta-1 receptor stimulation increases heart rate and cardiac contractility, further supporting cardiovascular function. Beta-2 receptor stimulation causes bronchodilation, relieving the severe bronchospasm that can lead to respiratory failure. Additionally, epinephrine helps stabilize mast cells and basophils, reducing further release of inflammatory mediators like histamine, leukotrienes, and prostaglandins. The medication should be administered intramuscularly into the lateral thigh (vastus lateralis muscle) for optimal absorption. While corticosteroids, antihistamines, and bronchodilators may be used as adjunctive therapies, they have slower onset times and cannot address all the life-threatening manifestations of anaphylaxis. Delay in epinephrine administration is associated with increased morbidity and mortality, making immediate recognition and treatment crucial for patient survival.",
      studyTips: [
        "Review anaphylaxis pathophysiology",
        "Study epinephrine mechanism of action",
        "Practice emergency management protocols",
        "Learn about allergen identification"
      ]
    },
    {
      question: "Which vitamin deficiency causes pernicious anemia?",
      options: [
        "Vitamin B1 (Thiamine)",
        "Vitamin B6 (Pyridoxine)",
        "Vitamin B12 (Cobalamin)",
        "Vitamin B9 (Folate)"
      ],
      correct: 2,
      category: "Hematology",
      explanation: "Vitamin B12 (cobalamin) deficiency causes pernicious anemia, a type of megaloblastic anemia characterized by the production of large, immature, and dysfunctional red blood cells. This condition occurs due to impaired DNA synthesis in rapidly dividing cells, particularly those in the bone marrow responsible for erythropoiesis. Vitamin B12 serves as an essential cofactor in two critical enzymatic reactions: the conversion of methylmalonyl-CoA to succinyl-CoA (important for fatty acid metabolism) and the conversion of homocysteine to methionine (crucial for DNA methylation and synthesis). When B12 is deficient, DNA synthesis becomes impaired while RNA synthesis continues normally, resulting in nuclear-cytoplasmic dyssynchrony and the formation of megaloblasts (large, immature red blood cell precursors). Pernicious anemia specifically refers to B12 deficiency caused by autoimmune destruction of gastric parietal cells, which produce intrinsic factor necessary for B12 absorption in the terminal ileum. This autoimmune process leads to gastric atrophy and loss of intrinsic factor production, making dietary B12 absorption impossible even with adequate intake. Patients with pernicious anemia may also develop neurological complications due to demyelination of peripheral nerves and the spinal cord, manifesting as peripheral neuropathy, subacute combined degeneration, and cognitive impairment. Treatment involves lifelong vitamin B12 supplementation, typically through intramuscular injection to bypass the absorption defect, though high-dose oral supplementation may be effective in some cases.",
      studyTips: [
        "Study vitamin B12 metabolism pathway",
        "Review types of anemia classification",
        "Learn about intrinsic factor role",
        "Practice blood smear interpretation"
      ]
    },
    {
      question: "What is the mechanism of action of ACE inhibitors?",
      options: [
        "Block angiotensin II receptors",
        "Inhibit angiotensin-converting enzyme",
        "Block calcium channels",
        "Inhibit beta-adrenergic receptors"
      ],
      correct: 1,
      category: "Pharmacology",
      explanation: "ACE inhibitors work by blocking the angiotensin-converting enzyme, which is responsible for converting angiotensin I to angiotensin II in the renin-angiotensin-aldosterone system (RAAS). This mechanism is crucial for understanding their therapeutic effects in treating hypertension, heart failure, and preventing cardiovascular complications in diabetes. Angiotensin II is a potent vasoconstrictor that increases blood pressure through direct arterial constriction and stimulates aldosterone release from the adrenal cortex. Aldosterone promotes sodium and water retention by the kidneys, further contributing to increased blood volume and pressure. By inhibiting ACE, these medications reduce angiotensin II production, leading to vasodilation, decreased peripheral resistance, and reduced blood pressure. Additionally, decreased aldosterone levels result in mild diuretic effects with potassium retention, which can lead to hyperkalemia as a potential side effect. ACE inhibitors also reduce the breakdown of bradykinin, a vasodilator peptide, which contributes to their antihypertensive effects but may cause the characteristic dry cough in some patients. These medications provide cardiovascular protection beyond blood pressure reduction, including improved endothelial function, reduced inflammation, and prevention of left ventricular remodeling after myocardial infarction. They are particularly beneficial in patients with diabetes, as they help prevent diabetic nephropathy progression. Common examples include lisinopril, enalapril, and captopril. Healthcare providers must monitor renal function and potassium levels when initiating therapy, especially in patients with existing kidney disease or those taking potassium supplements.",
      studyTips: [
        "Study renin-angiotensin-aldosterone system",
        "Review cardiovascular pharmacology",
        "Learn about drug side effects",
        "Practice drug interaction scenarios"
      ]
    }
  ]);

  // Functions
  const handleAnswerSelect = (questionIndex, answerIndex) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }));
    
    // Show immediate feedback for practice mode if enabled
    if (activeTab === 'practice' && immediateFeedbackEnabled) {
      setShowAnswerFeedback(prev => ({
        ...prev,
        [questionIndex]: true
      }));
    }
  };

  const startQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setScore(null);
    setShowAnswerFeedback({});
  };

  const generateQuestionsFromBooks = async () => {
    if (uploadedFiles.length === 0) return;
    
    setIsGeneratingQuestions(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Generate AI-based questions
    const aiQuestions = [
      {
        question: "Based on your uploaded material: What is the mechanism of action of ACE inhibitors?",
        options: [
          "Block angiotensin II receptors",
          "Inhibit angiotensin-converting enzyme",
          "Block calcium channels",
          "Inhibit beta-adrenergic receptors"
        ],
        correct: 1,
        explanation: "ACE inhibitors work by blocking the angiotensin-converting enzyme, which is responsible for converting angiotensin I to angiotensin II in the renin-angiotensin-aldosterone system (RAAS). According to your uploaded material, this mechanism is fundamental to their therapeutic efficacy in treating cardiovascular conditions. Angiotensin II is a powerful vasoconstrictor that not only increases blood pressure through direct arterial constriction but also stimulates the release of aldosterone from the adrenal cortex. Aldosterone promotes sodium and water retention by the kidneys, contributing to increased blood volume and elevated blood pressure. By inhibiting the ACE enzyme, these medications effectively reduce angiotensin II production, resulting in vasodilation, decreased peripheral vascular resistance, and subsequent blood pressure reduction. The therapeutic benefits extend beyond simple blood pressure control. Reduced aldosterone levels lead to mild diuretic effects with potassium retention, which is why patients may develop hyperkalemia as a side effect. ACE inhibitors also prevent the breakdown of bradykinin, a natural vasodilator, which contributes to their antihypertensive effects but may cause the characteristic dry cough experienced by some patients. These medications provide significant cardiovascular protection through improved endothelial function, reduced inflammation, and prevention of pathological cardiac remodeling following myocardial infarction. They are particularly valuable in diabetic patients as they help prevent the progression of diabetic nephropathy by reducing intraglomerular pressure and proteinuria."
      },
      {
        question: "From your study material: Which type of diabetes is characterized by insulin resistance?",
        options: [
          "Type 1 diabetes",
          "Type 2 diabetes",
          "Gestational diabetes",
          "MODY diabetes"
        ],
        correct: 1,
        explanation: "Type 2 diabetes is primarily characterized by insulin resistance, often combined with relative insulin deficiency, as detailed in your uploaded study materials. This complex metabolic disorder represents approximately 90-95% of all diabetes cases and involves a progressive pathophysiology that begins with insulin resistance in peripheral tissues, particularly skeletal muscle, liver, and adipose tissue. In the early stages, pancreatic beta cells compensate by producing increased amounts of insulin to maintain normal glucose levels, a condition known as hyperinsulinemia. However, over time, this compensatory mechanism becomes insufficient as beta cell function deteriorates, leading to relative insulin deficiency and overt hyperglycemia. The insulin resistance in Type 2 diabetes is multifactorial, involving genetic predisposition, obesity (particularly visceral adiposity), physical inactivity, and age-related factors. At the cellular level, insulin resistance manifests as decreased glucose uptake by muscle cells, impaired suppression of hepatic glucose production, and increased lipolysis in adipose tissue. This contrasts sharply with Type 1 diabetes, which is an autoimmune condition resulting in absolute insulin deficiency due to beta cell destruction. Gestational diabetes involves insulin resistance that develops during pregnancy due to hormonal changes, while MODY (Maturity-Onset Diabetes of the Young) represents a group of monogenic diabetes disorders with specific genetic mutations affecting beta cell function. Understanding these distinctions is crucial for appropriate treatment strategies, as Type 2 diabetes management focuses on improving insulin sensitivity through lifestyle modifications, metformin, and other insulin-sensitizing agents, while Type 1 diabetes requires insulin replacement therapy."
      }
    ];
    
    setQuestions(aiQuestions);
    setIsGeneratingQuestions(false);
    setQuizStarted(true);
  };

  // S3 Library MCQ Generation Function
  const generateMCQFromS3Library = async (libraryOptions) => {
    setIsGeneratingQuestions(true);
    setActiveTab('s3-library'); // Switch to quiz view
    
    try {
      const { data: mcqData } = await apiClient.post('/secureneat/library/generate-mcq/', libraryOptions);
      
      // Convert backend response to frontend format
      let formattedQuestions = [];
      
      if (mcqData.mcq_type === 'chapter_wise') {
        // Handle chapter-wise questions
        mcqData.chapters.forEach(chapter => {
          chapter.questions.forEach(q => {
            formattedQuestions.push({
              question: q.question,
              options: q.options,
              correct: q.correct_answer,
              explanation: q.explanation,
              category: chapter.chapter_title,
              source: `${mcqData.document_title} - ${chapter.chapter_title}`
            });
          });
        });
      } else {
        // Handle full book questions
        formattedQuestions = mcqData.questions.map(q => ({
          question: q.question,
          options: q.options,
          correct: q.correct_answer,
          explanation: q.explanation,
          category: 'AI Generated',
          source: mcqData.document_title
        }));
      }
      
      if (formattedQuestions.length === 0) {
        throw new Error('No questions were generated');
      }
      
      setQuestions(formattedQuestions);
      setQuizStarted(true);
      
      // Show success message
      alert(`Successfully generated ${formattedQuestions.length} questions from "${libraryOptions.filename}"`);
      
    } catch (error) {
      console.error('S3 Library MCQ generation error:', error);
      const msg = error.response?.data?.error || error.message || 'Failed to generate MCQs';
      alert(`Failed to generate MCQs: ${msg}`);
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  const submitQuiz = () => {
    const correctAnswers = Object.entries(selectedAnswers).filter(
      ([index, answer]) => answer === questions[parseInt(index)]?.correct
    ).length;
    
    const percentage = Math.round((correctAnswers / questions.length) * 100);
    setScore(percentage);
    setShowResultsModal(true);
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setScore(null);
    setShowResultsModal(false);
    setShowAnswerFeedback({});
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const newFiles = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      file: file
    }));
    
    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  // PDF Generation Function
  const generatePDFReport = async () => {
    if (!reportContentRef.current) return;

    try {
      // Create a temporary div for PDF content
      const reportElement = document.createElement('div');
      reportElement.style.background = 'white';
      reportElement.style.padding = '20px';
      reportElement.style.width = '800px';
      reportElement.style.fontFamily = 'Arial, sans-serif';
      
      // Calculate statistics
      const correctAnswers = Object.values(selectedAnswers).filter((answer, index) => answer === questions[index]?.correct).length;
      const incorrectAnswers = Object.values(selectedAnswers).filter((answer, index) => answer !== questions[index]?.correct && answer !== undefined).length;
      const skippedAnswers = questions.length - Object.keys(selectedAnswers).length;
      const completionRate = Math.round((Object.keys(selectedAnswers).length / questions.length) * 100);

      // Generate category statistics
      const categoryStats = {};
      questions.forEach((question, index) => {
        const category = question.category || 'General';
        if (!categoryStats[category]) {
          categoryStats[category] = { total: 0, correct: 0 };
        }
        categoryStats[category].total++;
        if (selectedAnswers[index] === question.correct) {
          categoryStats[category].correct++;
        }
      });

      // Create PDF content
      reportElement.innerHTML = `
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 3px solid #007bff; padding-bottom: 20px;">
          <h1 style="color: #007bff; margin: 0; font-size: 28px;">🏥 SecureNeat MCQ Assessment Report</h1>
          <p style="margin: 5px 0; color: #666; font-size: 16px;">Professional Performance Analysis</p>
          <p style="margin: 5px 0; color: #888; font-size: 14px;">Generated on ${new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</p>
        </div>

        <div style="margin-bottom: 30px;">
          <h2 style="color: #333; border-bottom: 2px solid #eee; padding-bottom: 10px;">📊 Executive Summary</h2>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 20px 0;">
            <div style="background: linear-gradient(135deg, #28a745, #20c997); color: white; padding: 20px; border-radius: 10px; text-align: center;">
              <h3 style="margin: 0; font-size: 36px;">${score}%</h3>
              <p style="margin: 5px 0;">Overall Score</p>
              <p style="margin: 0; font-size: 14px;">${correctAnswers}/${questions.length} Correct</p>
            </div>
            <div style="background: linear-gradient(135deg, #17a2b8, #6f42c1); color: white; padding: 20px; border-radius: 10px; text-align: center;">
              <h3 style="margin: 0; font-size: 36px;">${completionRate}%</h3>
              <p style="margin: 5px 0;">Completion Rate</p>
              <p style="margin: 0; font-size: 14px;">${Object.keys(selectedAnswers).length}/${questions.length} Attempted</p>
            </div>
          </div>
          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4 style="color: #333; margin-bottom: 10px;">Performance Grade</h4>
            <p style="margin: 0; font-size: 18px; font-weight: bold; color: ${
              score >= 90 ? '#28a745' : score >= 80 ? '#17a2b8' : score >= 70 ? '#ffc107' : '#dc3545'
            };">
              ${score >= 90 ? '🏆 Excellent (A+)' : score >= 80 ? '🎯 Very Good (A)' : score >= 70 ? '📈 Good (B)' : '📚 Needs Improvement (C)'}
            </p>
          </div>
        </div>

        <div style="margin-bottom: 30px;">
          <h2 style="color: #333; border-bottom: 2px solid #eee; padding-bottom: 10px;">📈 Performance Breakdown</h2>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin: 20px 0;">
            <div style="background: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 8px; text-align: center;">
              <h3 style="color: #155724; margin: 0;">${correctAnswers}</h3>
              <p style="color: #155724; margin: 5px 0;">✅ Correct</p>
            </div>
            <div style="background: #f8d7da; border: 1px solid #f5c6cb; padding: 15px; border-radius: 8px; text-align: center;">
              <h3 style="color: #721c24; margin: 0;">${incorrectAnswers}</h3>
              <p style="color: #721c24; margin: 5px 0;">❌ Incorrect</p>
            </div>
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; text-align: center;">
              <h3 style="color: #856404; margin: 0;">${skippedAnswers}</h3>
              <p style="color: #856404; margin: 5px 0;">⏭️ Skipped</p>
            </div>
          </div>
        </div>

        <div style="margin-bottom: 30px;">
          <h2 style="color: #333; border-bottom: 2px solid #eee; padding-bottom: 10px;">🎯 Category Performance</h2>
          ${Object.entries(categoryStats).map(([category, stats]) => {
            const percentage = Math.round((stats.correct / stats.total) * 100);
            return `
              <div style="margin: 15px 0; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                  <span style="font-weight: bold; color: #333;">${category}</span>
                  <span style="color: #666;">${stats.correct}/${stats.total} (${percentage}%)</span>
                </div>
                <div style="background: #e9ecef; height: 12px; border-radius: 6px; overflow: hidden;">
                  <div style="background: ${percentage >= 80 ? '#28a745' : percentage >= 60 ? '#ffc107' : '#dc3545'}; height: 100%; width: ${percentage}%; transition: width 0.3s;"></div>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <div style="margin-bottom: 30px;">
          <h2 style="color: #333; border-bottom: 2px solid #eee; padding-bottom: 10px;">💡 Study Recommendations</h2>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
            <div style="background: #d1ecf1; border: 1px solid #bee5eb; padding: 15px; border-radius: 8px;">
              <h4 style="color: #0c5460; margin-bottom: 10px;">✨ Strengths</h4>
              ${Object.entries(categoryStats).filter(([category, stats]) => (stats.correct / stats.total) >= 0.8).length > 0 
                ? Object.entries(categoryStats).filter(([category, stats]) => (stats.correct / stats.total) >= 0.8).map(([category]) => 
                  `<p style="margin: 5px 0; color: #0c5460;">• Strong performance in ${category}</p>`
                ).join('')
                : '<p style="margin: 5px 0; color: #0c5460;">• Good foundational knowledge demonstrated</p>'
              }
            </div>
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px;">
              <h4 style="color: #856404; margin-bottom: 10px;">🎯 Areas for Improvement</h4>
              ${Object.entries(categoryStats).filter(([category, stats]) => (stats.correct / stats.total) < 0.6).length > 0 
                ? Object.entries(categoryStats).filter(([category, stats]) => (stats.correct / stats.total) < 0.6).map(([category]) => 
                  `<p style="margin: 5px 0; color: #856404;">• Focus more on ${category} concepts</p>`
                ).join('')
                : '<p style="margin: 5px 0; color: #856404;">• Excellent performance across all areas!</p>'
              }
            </div>
          </div>
        </div>

        <div style="margin-bottom: 30px;">
          <h2 style="color: #333; border-bottom: 2px solid #eee; padding-bottom: 10px;">📋 Question Review</h2>
          ${questions.map((question, index) => {
            const isCorrect = selectedAnswers[index] === question.correct;
            const wasAnswered = selectedAnswers[index] !== undefined;
            
            return `
              <div style="margin: 15px 0; padding: 15px; border-left: 4px solid ${
                !wasAnswered ? '#ffc107' : isCorrect ? '#28a745' : '#dc3545'
              }; background: #f8f9fa;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                  <strong>Q${index + 1}. ${question.category || 'General'}</strong>
                  <span style="background: ${!wasAnswered ? '#ffc107' : isCorrect ? '#28a745' : '#dc3545'}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">
                    ${!wasAnswered ? '⏭️ Skipped' : isCorrect ? '✅ Correct' : '❌ Incorrect'}
                  </span>
                </div>
                <p style="margin: 10px 0; color: #333;">${question.question}</p>
                <div style="margin: 10px 0;">
                  <p style="margin: 5px 0;"><strong>Your answer:</strong> ${
                    wasAnswered 
                      ? `${String.fromCharCode(65 + selectedAnswers[index])}. ${question.options[selectedAnswers[index]]}`
                      : 'Not answered'
                  }</p>
                  <p style="margin: 5px 0; color: #28a745;"><strong>Correct answer:</strong> ${String.fromCharCode(65 + question.correct)}. ${question.options[question.correct]}</p>
                </div>
                ${question.explanation ? `
                  <div style="background: white; padding: 10px; border-radius: 4px; margin-top: 10px;">
                    <strong>💡 Explanation:</strong> ${question.explanation}
                  </div>
                ` : ''}
              </div>
            `;
          }).join('')}
        </div>

        <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 2px solid #eee;">
          <p style="color: #666; font-size: 14px; margin: 0;">
            This report was generated by SecureNeat MCQ Assessment System<br>
            Mode: ${activeTab === 'practice' ? 'Practice Mode' : 'AI Generated Quiz'} • 
            Assessment ID: MCQ-${Date.now()}
          </p>
        </div>
      `;

      // Append to body temporarily for rendering
      document.body.appendChild(reportElement);

      // Generate canvas from the element
      const canvas = await html2canvas(reportElement, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        width: 800,
        height: reportElement.scrollHeight
      });

      // Remove the temporary element
      document.body.removeChild(reportElement);

      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Add the image to PDF
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, imgWidth, imgHeight);

      // Save the PDF
      const fileName = `SecureNeat_MCQ_Report_${new Date().toISOString().split('T')[0]}_Score${score}%.pdf`;
      pdf.save(fileName);

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF report. Please try again.');
    }
  };

  // If generating questions, show loading
  if (isGeneratingQuestions) {
    return (
      <div className="container-fluid p-4">
        <div className="text-center">
          <div style={{ fontSize: '4em', marginBottom: '20px' }}>🤖</div>
          <h3 className="mb-3">AI Question Generation in Progress</h3>
          <p className="text-muted mb-4">
            Our AI is analyzing your uploaded materials and generating customized questions...
          </p>
          <Spinner animation="border" variant="primary" className="mb-3" />
          <div className="progress-text">
            <small className="text-muted">
              Processing {uploadedFiles.length} file(s) • Generating {aiSettings.numberOfQuestions} questions
            </small>
          </div>
        </div>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="container-fluid p-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="h3 mb-1">
              <RiQuestionLine className="me-2" />
              MCQ Practice Center
            </h1>
            <p className="text-muted mb-0">Enhanced practice with AI-powered question generation</p>
          </div>
          <Badge bg="success" pill className="fs-6">
            ✅ Full Access
          </Badge>
        </div>

        {/* Success Alert */}
        <Alert variant="success" className="mb-4">
          <div className="d-flex align-items-center">
            <div className="me-2">🎯</div>
            <div>
              <strong>Enhanced MCQ Practice!</strong> Choose between traditional practice or AI-generated questions from your own study materials.
            </div>
          </div>
        </Alert>

        {/* Tab Navigation */}
        <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
          <Nav variant="pills" className="mb-4">
            <Nav.Item>
              <Nav.Link eventKey="practice">
                <RiBookOpenLine className="me-2" />
                Practice Mode
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="ai-book">
                <RiRobotLine className="me-2" />
                AI Book Mode
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="s3-library">
                <RiDatabase2Line className="me-2" />
                Cloud Library
              </Nav.Link>
            </Nav.Item>
          </Nav>

          <Tab.Content>
            {/* Practice Mode Tab */}
            <Tab.Pane eventKey="practice">
              <Card className="border-0 shadow-sm" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center mb-3">
                    <RiBookOpenLine className="me-2 text-primary" size={24} />
                    <h5 className="mb-0">Practice Mode Settings</h5>
                    <Button 
                      variant="outline-secondary" 
                      size="sm" 
                      className="ms-auto"
                      onClick={() => setShowSettingsModal(true)}
                    >
                      <RiSettingsLine className="me-1" />
                      Customize
                    </Button>
                  </div>
                  
                  <Row className="mb-3">
                    <Col md={6}>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Category:</span>
                        <Badge bg="primary">{practiceSettings.category}</Badge>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Questions:</span>
                        <Badge bg="info">{practiceSettings.numberOfQuestions}</Badge>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Difficulty:</span>
                        <Badge bg="warning">{practiceSettings.difficulty}</Badge>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Time Limit:</span>
                        <Badge bg="secondary">
                          {practiceSettings.timeLimit === 0 ? 'No Limit' : `${practiceSettings.timeLimit} min`}
                        </Badge>
                      </div>
                    </Col>
                  </Row>
                  
                  <Button 
                    variant="primary" 
                    size="lg" 
                    className="w-100"
                    onClick={startQuiz}
                  >
                    Start Practice Session
                  </Button>
                </Card.Body>
              </Card>
            </Tab.Pane>

            {/* AI Book Mode Tab */}
            <Tab.Pane eventKey="ai-book">
              <Card className="border-0 shadow-sm" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center mb-3">
                    <RiRobotLine className="me-2 text-success" size={24} />
                    <h5 className="mb-0">AI-Powered Question Generation</h5>
                  </div>
                  
                  <Alert variant="info" className="mb-3">
                    <strong>How it works:</strong> Upload your study materials (PDFs, texts) and our AI will generate customized MCQs based on the content, organized by chapters or as a consolidated test.
                  </Alert>

                  {/* Upload Section */}
                  <div className="mb-4">
                    <h6 className="mb-3">📚 Uploaded Study Materials</h6>
                    {uploadedFiles.length === 0 ? (
                      <div className="text-center py-4 border border-dashed rounded">
                        <RiUploadLine size={48} className="text-muted mb-2" />
                        <p className="text-muted mb-2">No files uploaded yet</p>
                        <Button 
                          variant="outline-primary" 
                          onClick={() => setShowUploadModal(true)}
                        >
                          <RiUploadLine className="me-2" />
                          Upload Study Materials
                        </Button>
                      </div>
                    ) : (
                      <div>
                        {uploadedFiles.map(file => (
                          <div key={file.id} className="d-flex align-items-center justify-content-between p-2 border rounded mb-2">
                            <div className="d-flex align-items-center">
                              <RiFileTextLine className="me-2 text-primary" />
                              <div>
                                <div className="fw-bold">{file.name}</div>
                                <small className="text-muted">{(file.size / 1024 / 1024).toFixed(2)} MB</small>
                              </div>
                            </div>
                            <Badge bg="success">Ready</Badge>
                          </div>
                        ))}
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={() => setShowUploadModal(true)}
                        >
                          <RiUploadLine className="me-1" />
                          Add More Files
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* AI Settings */}
                  <div className="mb-4">
                    <h6 className="mb-3">🤖 AI Generation Settings</h6>
                    <Row>
                      <Col md={6} className="mb-3">
                        <Form.Label>Question Mode</Form.Label>
                        <Form.Select 
                          value={aiSettings.chapterMode}
                          onChange={(e) => setAiSettings({...aiSettings, chapterMode: e.target.value})}
                        >
                          <option value="consolidated">Consolidated Test</option>
                          <option value="chapter-wise">Chapter-wise Questions</option>
                        </Form.Select>
                      </Col>
                      <Col md={6} className="mb-3">
                        <Form.Label>Number of Questions</Form.Label>
                        <Form.Select 
                          value={aiSettings.numberOfQuestions}
                          onChange={(e) => setAiSettings({...aiSettings, numberOfQuestions: parseInt(e.target.value)})}
                        >
                          <option value={5}>5 Questions</option>
                          <option value={10}>10 Questions</option>
                          <option value={15}>15 Questions</option>
                          <option value={20}>20 Questions</option>
                          <option value={25}>25 Questions</option>
                        </Form.Select>
                      </Col>
                      <Col md={6} className="mb-3">
                        <Form.Label>Time Limit</Form.Label>
                        <Form.Select 
                          value={aiSettings.timeLimit}
                          onChange={(e) => setAiSettings({...aiSettings, timeLimit: parseInt(e.target.value)})}
                        >
                          <option value={15}>15 minutes</option>
                          <option value={30}>30 minutes</option>
                          <option value={45}>45 minutes</option>
                          <option value={60}>60 minutes</option>
                          <option value={0}>No time limit</option>
                        </Form.Select>
                      </Col>
                      <Col md={6} className="mb-3">
                        <Form.Label>Difficulty Level</Form.Label>
                        <Form.Select 
                          value={aiSettings.difficulty}
                          onChange={(e) => setAiSettings({...aiSettings, difficulty: e.target.value})}
                        >
                          <option value="Mixed">Mixed</option>
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                        </Form.Select>
                      </Col>
                    </Row>
                  </div>

                  <Button 
                    variant="success" 
                    size="lg" 
                    className="w-100"
                    onClick={generateQuestionsFromBooks}
                    disabled={uploadedFiles.length === 0}
                  >
                    <RiRobotLine className="me-2" />
                    Generate AI Questions & Start Test
                  </Button>
                </Card.Body>
              </Card>
            </Tab.Pane>

            {/* S3 Library Tab */}
            <Tab.Pane eventKey="s3-library">
              <Card className="border-0 shadow-sm">
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center mb-3">
                    <RiDatabase2Line className="me-2 text-primary" size={24} />
                    <h5 className="mb-0">Cloud Library</h5>
                    <Badge bg="info" className="ms-auto">
                      AWS S3 Powered
                    </Badge>
                  </div>
                  
                  <p className="text-muted mb-4">
                    Access your collection of medical books, notes, and study materials stored in AWS S3. 
                    Generate AI-powered MCQs instantly from any document in your library.
                  </p>
                  
                  <S3LibraryBrowser 
                    onSelectBook={(book) => console.log('Selected book:', book)}
                    onGenerateMCQ={generateMCQFromS3Library}
                    isGenerating={isGeneratingQuestions}
                  />
                </Card.Body>
              </Card>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>

        {/* Practice Settings Modal */}
        <Modal show={showSettingsModal} onHide={() => setShowSettingsModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Practice Mode Settings</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Select 
                  value={practiceSettings.category}
                  onChange={(e) => setPracticeSettings({...practiceSettings, category: e.target.value})}
                >
                  <option value="General Medicine">General Medicine</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Surgery">Surgery</option>
                  <option value="Pharmacology">Pharmacology</option>
                  <option value="Pathology">Pathology</option>
                  <option value="Radiology">Radiology</option>
                </Form.Select>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label>Number of Questions</Form.Label>
                <Form.Select 
                  value={practiceSettings.numberOfQuestions}
                  onChange={(e) => setPracticeSettings({...practiceSettings, numberOfQuestions: parseInt(e.target.value)})}
                >
                  <option value={5}>5 Questions</option>
                  <option value={10}>10 Questions</option>
                  <option value={15}>15 Questions</option>
                  <option value={20}>20 Questions</option>
                  <option value={25}>25 Questions</option>
                </Form.Select>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label>Difficulty Level</Form.Label>
                <Form.Select 
                  value={practiceSettings.difficulty}
                  onChange={(e) => setPracticeSettings({...practiceSettings, difficulty: e.target.value})}
                >
                  <option value="Mixed">Mixed</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </Form.Select>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label>Time Limit (minutes)</Form.Label>
                <Form.Select 
                  value={practiceSettings.timeLimit}
                  onChange={(e) => setPracticeSettings({...practiceSettings, timeLimit: parseInt(e.target.value)})}
                >
                  <option value={0}>No Time Limit</option>
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>60 minutes</option>
                </Form.Select>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowSettingsModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setShowSettingsModal(false)}>
              Save Settings
            </Button>
          </Modal.Footer>
        </Modal>

        {/* File Upload Modal */}
        <Modal show={showUploadModal} onHide={() => setShowUploadModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Upload Study Materials</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Alert variant="info">
              <strong>Supported formats:</strong> PDF, DOC, DOCX, TXT, PPT, PPTX
              <br />
              <strong>Max file size:</strong> 50MB per file
            </Alert>
            
            <div className="text-center py-4 border border-dashed rounded mb-3">
              <RiUploadLine size={48} className="text-muted mb-3" />
              <p className="mb-3">Drag and drop your files here or click to browse</p>
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.txt,.ppt,.pptx"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
                id="file-upload"
              />
              <Button 
                variant="outline-primary"
                onClick={() => document.getElementById('file-upload').click()}
              >
                Browse Files
              </Button>
            </div>

            {uploadedFiles.length > 0 && (
              <div>
                <h6>Uploaded Files:</h6>
                {uploadedFiles.map(file => (
                  <div key={file.id} className="d-flex align-items-center justify-content-between p-2 border rounded mb-2">
                    <div className="d-flex align-items-center">
                      <RiFileTextLine className="me-2 text-primary" />
                      <div>
                        <div>{file.name}</div>
                        <small className="text-muted">{(file.size / 1024 / 1024).toFixed(2)} MB</small>
                      </div>
                    </div>
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => removeFile(file.id)}
                    >
                      <RiDeleteBinLine />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowUploadModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }

  // Quiz interface
  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="container-fluid p-4">
      {/* Quiz Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3>Question {currentQuestion + 1} of {questions.length}</h3>
          <small className="text-muted">
            {activeTab === 'ai-book' ? 'AI Generated Questions' : 'Practice Mode'} • 
            {practiceSettings.category || aiSettings.chapterMode}
          </small>
        </div>
        <div className="d-flex align-items-center">
          {activeTab === 'practice' && (
            <Form.Check 
              type="switch"
              id="immediate-feedback-switch"
              label="Immediate Feedback"
              checked={immediateFeedbackEnabled}
              onChange={(e) => setImmediateFeedbackEnabled(e.target.checked)}
              className="me-3"
            />
          )}
          <Button 
            variant="outline-secondary" 
            size="sm" 
            className="me-2"
            onClick={() => setShowResultsModal(true)}
          >
            <RiEyeLine className="me-1" />
            Review
          </Button>
          <Button 
            variant="outline-danger" 
            size="sm"
            onClick={() => {
              if (window.confirm('Are you sure you want to end this quiz?')) {
                resetQuiz();
              }
            }}
          >
            End Quiz
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      <ProgressBar 
        now={progress} 
        className="mb-4"
        style={{ height: '8px' }}
      />

      {/* Question Card */}
      <Card className="border-0 shadow-sm mb-4" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Card.Body className="p-4">
          <h5 className="mb-3">{question?.question}</h5>
          
          <div className="options">
            {question?.options.map((option, index) => {
              const isSelected = selectedAnswers[currentQuestion] === index;
              const isCorrect = index === question?.correct;
              const showFeedback = showAnswerFeedback[currentQuestion] && activeTab === 'practice' && immediateFeedbackEnabled;
              
              let optionClass = 'option-card p-3 mb-2 border rounded cursor-pointer ';
              let optionLetterClass = 'option-letter me-3 ';
              
              if (showFeedback) {
                if (isSelected && isCorrect) {
                  optionClass += 'border-success bg-success bg-opacity-10';
                  optionLetterClass += 'bg-success text-white';
                } else if (isSelected && !isCorrect) {
                  optionClass += 'border-danger bg-danger bg-opacity-10';
                  optionLetterClass += 'bg-danger text-white';
                } else if (!isSelected && isCorrect) {
                  optionClass += 'border-success bg-success bg-opacity-10';
                  optionLetterClass += 'bg-success text-white';
                } else {
                  optionClass += 'border-light';
                  optionLetterClass += 'bg-light';
                }
              } else {
                if (isSelected) {
                  optionClass += 'border-primary bg-light';
                  optionLetterClass += 'bg-primary text-white';
                } else {
                  optionLetterClass += 'bg-light';
                }
              }
              
              return (
                <div 
                  key={index} 
                  className={optionClass}
                  onClick={() => !showFeedback && handleAnswerSelect(currentQuestion, index)}
                  style={{ cursor: showFeedback ? 'default' : 'pointer' }}
                >
                  <div className="d-flex align-items-center">
                    <div className={optionLetterClass} style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold'
                    }}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="flex-grow-1">{option}</span>
                    {showFeedback && isSelected && isCorrect && (
                      <Badge bg="success" className="ms-2">
                        ✓ Correct
                      </Badge>
                    )}
                    {showFeedback && isSelected && !isCorrect && (
                      <Badge bg="danger" className="ms-2">
                        ✗ Incorrect
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Immediate Feedback Section */}
          {showAnswerFeedback[currentQuestion] && activeTab === 'practice' && immediateFeedbackEnabled && (
            <div className="mt-4">
              <Alert 
                variant={selectedAnswers[currentQuestion] === question?.correct ? 'success' : 'danger'}
                className="mb-3"
              >
                <div className="d-flex align-items-start">
                  <div className="me-2">
                    {selectedAnswers[currentQuestion] === question?.correct ? '🎉' : '📚'}
                  </div>
                  <div className="flex-grow-1">
                    <h6 className="mb-2">
                      {selectedAnswers[currentQuestion] === question?.correct 
                        ? 'Excellent! That\'s the correct answer.' 
                        : 'Not quite right, but that\'s how we learn!'}
                    </h6>
                    <div className="explanation-section">
                      <h6 className="text-primary mb-2">
                        <RiBookOpenLine className="me-2" />
                        Detailed Explanation:
                      </h6>
                      <div 
                        className="explanation-text p-3 rounded"
                        style={{
                          backgroundColor: 'rgba(0,0,0,0.05)',
                          lineHeight: '1.6',
                          fontSize: '0.95rem',
                          maxHeight: '300px',
                          overflowY: 'auto',
                          border: '1px solid rgba(0,0,0,0.1)'
                        }}
                      >
                        {question?.explanation}
                      </div>
                    </div>
                  </div>
                </div>
              </Alert>
              
              {/* Recommendation System for Wrong Answers */}
              {selectedAnswers[currentQuestion] !== question?.correct && (
                <Card className="border-warning bg-warning bg-opacity-10">
                  <Card.Body className="p-3">
                    <div className="d-flex align-items-start">
                      <div className="me-2">💡</div>
                      <div className="flex-grow-1">
                        <h6 className="mb-2 text-warning-emphasis">Study Recommendations</h6>
                        <p className="mb-2 small text-muted">
                          <strong>Topic:</strong> {question?.category}
                        </p>
                        <ul className="mb-0 small">
                          {question?.studyTips?.map((tip, tipIndex) => (
                            <li key={tipIndex} className="mb-1">{tip}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              )}
              
              {/* Continue Button */}
              <div className="text-center mt-3">
                <Button 
                  variant="outline-primary" 
                  onClick={() => {
                    if (currentQuestion < questions.length - 1) {
                      setCurrentQuestion(currentQuestion + 1);
                    }
                  }}
                  disabled={currentQuestion === questions.length - 1}
                >
                  {currentQuestion === questions.length - 1 ? 'Review Complete' : 'Continue to Next Question'}
                  {currentQuestion < questions.length - 1 && <RiArrowRightLine className="ms-1" />}
                </Button>
              </div>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Navigation */}
      <div className="d-flex justify-content-between" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Button 
          variant="outline-secondary"
          onClick={() => setCurrentQuestion(currentQuestion - 1)}
          disabled={currentQuestion === 0}
        >
          <RiArrowLeftLine className="me-1" />
          Previous
        </Button>
        
        {currentQuestion === questions.length - 1 ? (
          <Button 
            variant="success"
            onClick={submitQuiz}
            disabled={Object.keys(selectedAnswers).length !== questions.length}
          >
            <RiCheckLine className="me-1" />
            Finish Quiz
          </Button>
        ) : (
          <Button 
            variant="primary"
            onClick={() => setCurrentQuestion(currentQuestion + 1)}
            disabled={activeTab === 'practice' && !showAnswerFeedback[currentQuestion] && selectedAnswers[currentQuestion] !== undefined}
          >
            {activeTab === 'practice' && selectedAnswers[currentQuestion] !== undefined && !showAnswerFeedback[currentQuestion] 
              ? 'Select an answer first' 
              : 'Next'
            }
            <RiArrowRightLine className="ms-1" />
          </Button>
        )}
      </div>

      {/* Professional Results Report Modal */}
      <Modal show={showResultsModal} onHide={() => setShowResultsModal(false)} size="xl" className="results-modal">
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title className="d-flex align-items-center">
            <div className="me-2">📊</div>
            <div>
              <div>Professional Quiz Report</div>
              <small className="opacity-75">Comprehensive Performance Analysis</small>
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0" ref={reportContentRef}>
          {score !== null && (
            <div>
              {/* Executive Summary Header */}
              <div className="p-4" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                <Row className="align-items-center">
                  <Col md={8}>
                    <h3 className="mb-1">Performance Summary</h3>
                    <p className="mb-2 opacity-90">
                      Assessment Date: {new Date().toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                    <div className="d-flex align-items-center">
                      <div className="me-4">
                        <div className="h1 mb-0">{score}%</div>
                        <small>Overall Score</small>
                      </div>
                      <div className="me-4">
                        <div className="h5 mb-0">
                          {Object.values(selectedAnswers).filter((answer, index) => answer === questions[index]?.correct).length}/{questions.length}
                        </div>
                        <small>Correct Answers</small>
                      </div>
                      <div>
                        <Badge 
                          bg={score >= 90 ? 'success' : score >= 80 ? 'info' : score >= 70 ? 'warning' : 'danger'}
                          className="px-3 py-2"
                          style={{ fontSize: '0.9rem' }}
                        >
                          {score >= 90 ? '🏆 Excellent' : score >= 80 ? '🎯 Very Good' : score >= 70 ? '📈 Good' : '📚 Needs Improvement'}
                        </Badge>
                      </div>
                    </div>
                  </Col>
                  <Col md={4} className="text-end">
                    <div className="circular-progress" style={{ 
                      width: '120px', 
                      height: '120px', 
                      background: `conic-gradient(#28a745 ${score * 3.6}deg, rgba(255,255,255,0.3) 0deg)`,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto'
                    }}>
                      <div className="text-center" style={{ 
                        background: 'rgba(255,255,255,0.9)', 
                        borderRadius: '50%', 
                        width: '90px', 
                        height: '90px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#333'
                      }}>
                        <div className="h4 mb-0">{score}%</div>
                        <small>Score</small>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>

              <div className="p-4">
                {/* Performance Metrics Dashboard */}
                <Row className="mb-4">
                  <Col md={3}>
                    <Card className="text-center border-success h-100" style={{ background: 'linear-gradient(45deg, #28a745, #20c997)' }}>
                      <Card.Body className="text-white">
                        <div className="h2 mb-1">
                          {Object.values(selectedAnswers).filter((answer, index) => answer === questions[index]?.correct).length}
                        </div>
                        <div className="small">✅ Correct</div>
                        <div className="mt-2">
                          <div className="progress" style={{ height: '4px', background: 'rgba(255,255,255,0.3)' }}>
                            <div 
                              className="progress-bar bg-light" 
                              style={{ 
                                width: `${(Object.values(selectedAnswers).filter((answer, index) => answer === questions[index]?.correct).length / questions.length) * 100}%` 
                              }}
                            ></div>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={3}>
                    <Card className="text-center border-danger h-100" style={{ background: 'linear-gradient(45deg, #dc3545, #fd7e14)' }}>
                      <Card.Body className="text-white">
                        <div className="h2 mb-1">
                          {Object.values(selectedAnswers).filter((answer, index) => answer !== questions[index]?.correct && answer !== undefined).length}
                        </div>
                        <div className="small">❌ Incorrect</div>
                        <div className="mt-2">
                          <div className="progress" style={{ height: '4px', background: 'rgba(255,255,255,0.3)' }}>
                            <div 
                              className="progress-bar bg-light" 
                              style={{ 
                                width: `${(Object.values(selectedAnswers).filter((answer, index) => answer !== questions[index]?.correct && answer !== undefined).length / questions.length) * 100}%` 
                              }}
                            ></div>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={3}>
                    <Card className="text-center border-warning h-100" style={{ background: 'linear-gradient(45deg, #ffc107, #fd7e14)' }}>
                      <Card.Body className="text-white">
                        <div className="h2 mb-1">
                          {questions.length - Object.keys(selectedAnswers).length}
                        </div>
                        <div className="small">⏭️ Skipped</div>
                        <div className="mt-2">
                          <div className="progress" style={{ height: '4px', background: 'rgba(255,255,255,0.3)' }}>
                            <div 
                              className="progress-bar bg-light" 
                              style={{ 
                                width: `${((questions.length - Object.keys(selectedAnswers).length) / questions.length) * 100}%` 
                              }}
                            ></div>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={3}>
                    <Card className="text-center border-info h-100" style={{ background: 'linear-gradient(45deg, #17a2b8, #6f42c1)' }}>
                      <Card.Body className="text-white">
                        <div className="h2 mb-1">
                          {Math.round((Object.keys(selectedAnswers).length / questions.length) * 100)}%
                        </div>
                        <div className="small">📈 Completion</div>
                        <div className="mt-2">
                          <div className="progress" style={{ height: '4px', background: 'rgba(255,255,255,0.3)' }}>
                            <div 
                              className="progress-bar bg-light" 
                              style={{ 
                                width: `${(Object.keys(selectedAnswers).length / questions.length) * 100}%` 
                              }}
                            ></div>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>

                {/* Category Performance Analysis */}
                <Card className="mb-4 border-0 shadow-sm">
                  <Card.Header className="bg-light">
                    <h5 className="mb-0 d-flex align-items-center">
                      <span className="me-2">📊</span>
                      Category Performance Analysis
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    {(() => {
                      const categoryStats = {};
                      questions.forEach((question, index) => {
                        const category = question.category || 'General';
                        if (!categoryStats[category]) {
                          categoryStats[category] = { total: 0, correct: 0 };
                        }
                        categoryStats[category].total++;
                        if (selectedAnswers[index] === question.correct) {
                          categoryStats[category].correct++;
                        }
                      });

                      return Object.entries(categoryStats).map(([category, stats]) => {
                        const percentage = Math.round((stats.correct / stats.total) * 100);
                        return (
                          <div key={category} className="mb-3">
                            <div className="d-flex justify-content-between mb-1">
                              <span className="fw-bold">{category}</span>
                              <span className="text-muted">{stats.correct}/{stats.total} ({percentage}%)</span>
                            </div>
                            <div className="progress" style={{ height: '12px' }}>
                              <div 
                                className={`progress-bar ${
                                  percentage >= 80 ? 'bg-success' : 
                                  percentage >= 60 ? 'bg-warning' : 'bg-danger'
                                }`}
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </Card.Body>
                </Card>

                {/* AI-Powered Insights */}
                <Card className="mb-4 border-0" style={{ background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)' }}>
                  <Card.Header className="bg-transparent border-0">
                    <h5 className="mb-0 d-flex align-items-center text-primary">
                      <span className="me-2">🤖</span>
                      AI-Powered Learning Insights
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col md={6}>
                        <h6 className="text-success mb-2">✨ Strengths Identified</h6>
                        <ul className="list-unstyled">
                          {(() => {
                            const strongCategories = [];
                            const categoryStats = {};
                            questions.forEach((question, index) => {
                              const category = question.category || 'General';
                              if (!categoryStats[category]) {
                                categoryStats[category] = { total: 0, correct: 0 };
                              }
                              categoryStats[category].total++;
                              if (selectedAnswers[index] === question.correct) {
                                categoryStats[category].correct++;
                              }
                            });

                            Object.entries(categoryStats).forEach(([category, stats]) => {
                              if ((stats.correct / stats.total) >= 0.8) {
                                strongCategories.push(category);
                              }
                            });

                            return strongCategories.length > 0 ? strongCategories.map(cat => (
                              <li key={cat} className="mb-2">
                                <Badge bg="success" className="me-2">🎯</Badge>
                                Strong performance in {cat}
                              </li>
                            )) : [
                              <li key="general" className="mb-2">
                                <Badge bg="info" className="me-2">💪</Badge>
                                Good foundational knowledge demonstrated
                              </li>
                            ];
                          })()}
                        </ul>
                      </Col>
                      <Col md={6}>
                        <h6 className="text-warning mb-2">🎯 Growth Opportunities</h6>
                        <ul className="list-unstyled">
                          {(() => {
                            const weakCategories = [];
                            const categoryStats = {};
                            questions.forEach((question, index) => {
                              const category = question.category || 'General';
                              if (!categoryStats[category]) {
                                categoryStats[category] = { total: 0, correct: 0 };
                              }
                              categoryStats[category].total++;
                              if (selectedAnswers[index] === question.correct) {
                                categoryStats[category].correct++;
                              }
                            });

                            Object.entries(categoryStats).forEach(([category, stats]) => {
                              if ((stats.correct / stats.total) < 0.6) {
                                weakCategories.push(category);
                              }
                            });

                            return weakCategories.length > 0 ? weakCategories.map(cat => (
                              <li key={cat} className="mb-2">
                                <Badge bg="warning" className="me-2">📚</Badge>
                                Focus more on {cat} concepts
                              </li>
                            )) : [
                              <li key="general" className="mb-2">
                                <Badge bg="success" className="me-2">🌟</Badge>
                                Excellent performance across all areas!
                              </li>
                            ];
                          })()}
                        </ul>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>

                {/* Smart Recommendations */}
                <Card className="mb-4 border-0 shadow-sm">
                  <Card.Header className="bg-gradient" style={{ background: 'linear-gradient(90deg, #ff9a9e 0%, #fecfef 100%)' }}>
                    <h5 className="mb-0 d-flex align-items-center text-white">
                      <span className="me-2">💡</span>
                      Personalized Study Plan
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col md={4}>
                        <Card className="border-primary h-100">
                          <Card.Body className="text-center">
                            <div className="mb-2" style={{ fontSize: '2rem' }}>📖</div>
                            <h6>Immediate Actions</h6>
                            <ul className="list-unstyled small">
                              <li>• Review incorrect answers</li>
                              <li>• Focus on weak categories</li>
                              <li>• Practice similar questions</li>
                            </ul>
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col md={4}>
                        <Card className="border-success h-100">
                          <Card.Body className="text-center">
                            <div className="mb-2" style={{ fontSize: '2rem' }}>🎯</div>
                            <h6>Next Steps</h6>
                            <ul className="list-unstyled small">
                              <li>• Take advanced practice tests</li>
                              <li>• Study clinical case scenarios</li>
                              <li>• Join study groups</li>
                            </ul>
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col md={4}>
                        <Card className="border-info h-100">
                          <Card.Body className="text-center">
                            <div className="mb-2" style={{ fontSize: '2rem' }}>🚀</div>
                            <h6>Long-term Goals</h6>
                            <ul className="list-unstyled small">
                              <li>• Maintain consistent practice</li>
                              <li>• Track progress weekly</li>
                              <li>• Seek mentorship</li>
                            </ul>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>

                {/* Detailed Question Review */}
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-dark text-white">
                    <h5 className="mb-0 d-flex align-items-center">
                      <span className="me-2">📋</span>
                      Detailed Question Review
                    </h5>
                  </Card.Header>
                  <Card.Body style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {questions.map((question, index) => {
                      const isCorrect = selectedAnswers[index] === question.correct;
                      const wasAnswered = selectedAnswers[index] !== undefined;
                      
                      return (
                        <Card key={index} className={`mb-3 border-start border-4 ${
                          !wasAnswered ? 'border-warning' : isCorrect ? 'border-success' : 'border-danger'
                        }`}>
                          <Card.Body className="p-3">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <h6 className="mb-0 d-flex align-items-center">
                                <span className="me-2">Q{index + 1}.</span>
                                <Badge bg={question.category === 'Cardiology' ? 'danger' : 
                                           question.category === 'Neurology' ? 'info' :
                                           question.category === 'Pharmacology' ? 'warning' :
                                           question.category === 'Hematology' ? 'success' : 'secondary'} 
                                       className="me-2">
                                  {question.category}
                                </Badge>
                              </h6>
                              <Badge bg={!wasAnswered ? 'warning' : isCorrect ? 'success' : 'danger'}>
                                {!wasAnswered ? '⏭️ Skipped' : isCorrect ? '✅ Correct' : '❌ Incorrect'}
                              </Badge>
                            </div>
                            
                            <p className="mb-2 small">{question.question}</p>
                            
                            <div className="row small">
                              <div className="col-md-6">
                                <strong>Your answer:</strong> {
                                  wasAnswered 
                                    ? `${String.fromCharCode(65 + selectedAnswers[index])}. ${question.options[selectedAnswers[index]]}`
                                    : 'Not answered'
                                }
                              </div>
                              <div className="col-md-6">
                                <strong className="text-success">Correct answer:</strong> {String.fromCharCode(65 + question.correct)}. {question.options[question.correct]}
                              </div>
                            </div>
                            
                            {question.explanation && (
                              <div className="mt-2 p-2 bg-light rounded">
                                <small><strong>💡 Explanation:</strong> {question.explanation}</small>
                              </div>
                            )}
                          </Card.Body>
                        </Card>
                      );
                    })}
                  </Card.Body>
                </Card>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="bg-light">
          <div className="d-flex justify-content-between w-100">
            <div className="d-flex align-items-center">
              <small className="text-muted">
                📅 Generated on {new Date().toLocaleString()} • 
                🎯 {activeTab === 'practice' ? 'Practice Mode' : 'AI Generated Quiz'}
              </small>
            </div>
            <div>
              <Button 
                variant="outline-success" 
                onClick={generatePDFReport} 
                className="me-2"
                disabled={score === null}
              >
                <RiDownloadLine className="me-1" />
                Download PDF Report
              </Button>
              <Button variant="outline-primary" onClick={() => setShowResultsModal(false)} className="me-2">
                Close Report
              </Button>
              <Button variant="primary" onClick={resetQuiz}>
                <span className="me-1">🔄</span>
                New Quiz
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EnhancedSecureNeatMCQ;
