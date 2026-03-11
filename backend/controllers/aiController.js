const Resume = require('../models/Resume');
const ResumeAnalysis = require('../models/ResumeAnalysis');
const InterviewQuestions = require('../models/InterviewQuestions');
const { getAIResponse } = require('../utils/aiHelper');

// @desc    Analyze resume for suggestions
// @route   POST /api/ai/analyze-resume
// @access  Private
exports.analyzeResume = async (req, res, next) => {
  try {
    const { resumeId } = req.body;
    const resume = await Resume.findById(resumeId);

    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }

    const prompt = `
      Analyze this resume text and provide:
      1. Bullet point suggestions for improvement.
      2. Measurable achievement tips.
      3. Keyword optimization keywords.
      
      Format the response strictly as a JSON object with keys: "suggestions" (array of strings), "achievements" (array of strings), "keywords" (array of strings). Do NOT wrap in markdown \`\`\`json. Output ONLY valid JSON.
      
      Resume text: ${resume.extractedText.substring(0, 4000)}
    `;

    const aiResponse = await getAIResponse(prompt);
    
    // Attempt to parse JSON from AI response (sanitize if needed)
    let parsedData;
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      parsedData = jsonMatch ? JSON.parse(jsonMatch[0]) : { raw: aiResponse };
    } catch (e) {
      parsedData = { raw: aiResponse };
    }

    // Save or update analysis
    let analysis = await ResumeAnalysis.findOne({ resumeId });
    
    const suggestionList = Array.isArray(parsedData.suggestions) 
      ? parsedData.suggestions 
      : [aiResponse];

    if (analysis) {
      analysis.suggestions = suggestionList;
      await analysis.save();
    } else {
      analysis = await ResumeAnalysis.create({
        resumeId,
        userId: req.user.id,
        suggestions: suggestionList
      });
    }

    res.status(200).json({
      success: true,
      data: analysis
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Analyze skill gaps
// @route   POST /api/ai/skill-gap
// @access  Private
exports.analyzeSkillGap = async (req, res, next) => {
  try {
    const { resumeId, targetRole } = req.body;
    const resume = await Resume.findById(resumeId);

    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }

    const prompt = `
      Compare these resume skills with current market requirements for a "${targetRole || 'Software Engineer'}" role.
      List the missing skills.
      
      Format the response strictly as a JSON object with a key "missingSkills" which is an array of strings. Do NOT wrap in markdown \`\`\`json. Output ONLY valid JSON.
      
      Resume text: ${resume.extractedText.substring(0, 4000)}
    `;

    const aiResponse = await getAIResponse(prompt);
    
    let parsedData;
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      parsedData = jsonMatch ? JSON.parse(jsonMatch[0]) : { missingSkills: [] };
    } catch (e) {
      parsedData = { missingSkills: [] };
    }

    let analysis = await ResumeAnalysis.findOne({ resumeId });
    const skillGaps = parsedData.missingSkills || [];

    if (analysis) {
      analysis.skillGaps = skillGaps;
      await analysis.save();
    } else {
      analysis = await ResumeAnalysis.create({
        resumeId,
        userId: req.user.id,
        skillGaps
      });
    }

    res.status(200).json({
      success: true,
      data: analysis
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Match resume to job roles
// @route   POST /api/ai/job-match
// @access  Private
exports.jobMatch = async (req, res, next) => {
  try {
    const { resumeId } = req.body;
    const resume = await Resume.findById(resumeId);

    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }

    const prompt = `
      Analyze this resume and return the top 3 best matching job roles.
      
      Format the response strictly as a JSON object with a key "matches" which is an array of strings. Do NOT wrap in markdown \`\`\`json. Output ONLY valid JSON.
      
      Resume text: ${resume.extractedText.substring(0, 4000)}
    `;

    const aiResponse = await getAIResponse(prompt);
    
    let parsedData;
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      parsedData = jsonMatch ? JSON.parse(jsonMatch[0]) : { matches: [] };
    } catch (e) {
      parsedData = { matches: [] };
    }

    let analysis = await ResumeAnalysis.findOne({ resumeId });
    const jobMatches = parsedData.matches || [];

    if (analysis) {
      analysis.jobMatches = jobMatches;
      await analysis.save();
    } else {
      analysis = await ResumeAnalysis.create({
        resumeId,
        userId: req.user.id,
        jobMatches
      });
    }

    res.status(200).json({
      success: true,
      data: analysis
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Generate interview questions
// @route   POST /api/ai/interview-questions
// @access  Private
exports.generateQuestions = async (req, res, next) => {
  try {
    const { resumeId } = req.body;
    const resume = await Resume.findById(resumeId);

    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }

    const prompt = `
      Based on this resume, generate 3 technical and 2 behavioral interview questions.
      Include a suggested answer tip for each.
      
      Format the response strictly as a JSON object with a key "questions" which is an array of objects.
      Each object should have: "type" (Technical or Behavioral), "question", "suggestedAnswer". Do NOT wrap in markdown \`\`\`json. Output ONLY valid JSON.
      
      Resume text: ${resume.extractedText.substring(0, 4000)}
    `;

    const aiResponse = await getAIResponse(prompt);
    
    let parsedData;
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      parsedData = jsonMatch ? JSON.parse(jsonMatch[0]) : { questions: [] };
    } catch (e) {
      parsedData = { questions: [] };
    }

    const interviewQuestions = await InterviewQuestions.create({
      userId: req.user.id,
      resumeId,
      questions: parsedData.questions || []
    });

    res.status(201).json({
      success: true,
      data: interviewQuestions
    });
  } catch (err) {
    next(err);
  }
};