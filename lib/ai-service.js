import Groq from 'groq';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

class AIService {
  constructor() {
    this.model = 'llama3-8b-8192'; // Fast and cost-effective model
  }

  async generateQuiz(topic, subject, level, numQuestions = 5) {
    try {
      const prompt = this.createQuizPrompt(topic, subject, level, numQuestions);
      
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are an expert educational content creator. Generate engaging, accurate, and educational quiz questions.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        model: this.model,
        temperature: 0.7,
        max_tokens: 2000,
      });

      const response = completion.choices[0]?.message?.content;
      return this.parseQuizResponse(response, topic, subject, level);
    } catch (error) {
      console.error('Error generating quiz:', error);
      return this.getFallbackQuiz(topic, subject, level, numQuestions);
    }
  }

  async generateStudyPlan(topic, subject, level) {
    try {
      const prompt = this.createStudyPlanPrompt(topic, subject, level);
      
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are an expert educational planner. Create comprehensive, structured study plans that help students learn effectively.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        model: this.model,
        temperature: 0.7,
        max_tokens: 3000,
      });

      const response = completion.choices[0]?.message?.content;
      return this.parseStudyPlanResponse(response, topic, subject, level);
    } catch (error) {
      console.error('Error generating study plan:', error);
      return this.getFallbackStudyPlan(topic, subject, level);
    }
  }

  createQuizPrompt(topic, subject, level, numQuestions) {
    const difficultyMap = {
      beginner: 'basic concepts suitable for beginners',
      intermediate: 'intermediate level concepts with some complexity',
      advanced: 'advanced concepts requiring deep understanding'
    };

    return `Create ${numQuestions} multiple-choice quiz questions about "${topic}" in the subject "${subject}" at ${difficultyMap[level]} level.

Requirements:
- Each question should have 4 options (A, B, C, D)
- Include detailed explanations for correct answers
- Questions should be engaging and educational
- Cover different aspects of the topic
- Include the concept being tested

Format your response as JSON:
{
  "title": "Quiz Title",
  "questions": [
    {
      "question": "Question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Detailed explanation",
      "concept": "Concept being tested",
      "difficulty": "${level}",
      "category": "${subject}"
    }
  ]
}`;
  }

  createStudyPlanPrompt(topic, subject, level) {
    const difficultyMap = {
      beginner: 'basic foundational concepts',
      intermediate: 'intermediate concepts with practical applications',
      advanced: 'advanced concepts with deep analysis'
    };

    return `Create a comprehensive 5-day study plan for learning "${topic}" in "${subject}" at ${difficultyMap[level]} level.

Requirements:
- 5 days of structured learning
- Each day should have 4-5 specific tasks
- Include various learning activities (reading, videos, practice, etc.)
- Provide relevant resource links (YouTube, articles, etc.)
- Focus on progressive learning
- Include assessment and review activities

Format your response as JSON:
{
  "title": "Study Plan Title",
  "description": "Plan description",
  "difficulty": "${level}",
  "days": [
    {
      "day": 1,
      "title": "Day Title",
      "duration": "2-3 hours",
      "tasks": [
        {
          "id": 1,
          "title": "Task description",
          "type": "reading|video|quiz|practice|activity",
          "estimatedDuration": 30
        }
      ],
      "resources": [
        {
          "title": "Resource title",
          "url": "https://youtube.com/search?q=...",
          "type": "video|document|interactive"
        }
      ]
    }
  ]
}`;
  }

  parseQuizResponse(response, topic, subject, level) {
    try {
      // Try to extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          title: parsed.title || `${topic} Quiz`,
          topic,
          subject,
          level,
          questions: parsed.questions || [],
          totalQuestions: parsed.questions?.length || 0,
          timeLimit: 30,
        };
      }
    } catch (error) {
      console.error('Error parsing quiz response:', error);
    }
    
    return this.getFallbackQuiz(topic, subject, level, 5);
  }

  parseStudyPlanResponse(response, topic, subject, level) {
    try {
      // Try to extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          title: parsed.title || `${topic} Study Plan`,
          description: parsed.description || `Comprehensive study plan for ${topic}`,
          topic,
          subject,
          level,
          difficulty: parsed.difficulty || level,
          days: parsed.days || [],
          totalDays: parsed.days?.length || 5,
          progress: 0,
          status: 'not_started',
        };
      }
    } catch (error) {
      console.error('Error parsing study plan response:', error);
    }
    
    return this.getFallbackStudyPlan(topic, subject, level);
  }

  getFallbackQuiz(topic, subject, level, numQuestions) {
    // Return a basic quiz structure when AI generation fails
    const questions = [];
    for (let i = 0; i < numQuestions; i++) {
      questions.push({
        question: `Sample question ${i + 1} about ${topic}`,
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctAnswer: 0,
        explanation: 'This is a sample explanation for the correct answer.',
        concept: `${subject} - ${topic}`,
        difficulty: level,
        category: subject,
      });
    }

    return {
      title: `${topic} Quiz`,
      topic,
      subject,
      level,
      questions,
      totalQuestions: numQuestions,
      timeLimit: 30,
    };
  }

  getFallbackStudyPlan(topic, subject, level) {
    // Return a basic study plan structure when AI generation fails
    const days = [];
    for (let i = 1; i <= 5; i++) {
      days.push({
        day: i,
        title: `Day ${i}: Introduction to ${topic}`,
        duration: '2-3 hours',
        tasks: [
          {
            id: i * 4 - 3,
            title: 'Read basic concepts',
            type: 'reading',
            estimatedDuration: 30,
          },
          {
            id: i * 4 - 2,
            title: 'Watch educational videos',
            type: 'video',
            estimatedDuration: 45,
          },
          {
            id: i * 4 - 1,
            title: 'Practice exercises',
            type: 'practice',
            estimatedDuration: 60,
          },
          {
            id: i * 4,
            title: 'Review and reflect',
            type: 'activity',
            estimatedDuration: 30,
          },
        ],
        resources: [
          {
            title: `${topic} Tutorial`,
            url: `https://www.youtube.com/results?search_query=${encodeURIComponent(topic)}`,
            type: 'video',
          },
        ],
      });
    }

    return {
      title: `${topic} Study Plan`,
      description: `Comprehensive study plan for learning ${topic}`,
      topic,
      subject,
      level,
      difficulty: level,
      days,
      totalDays: 5,
      progress: 0,
      status: 'not_started',
    };
  }
}

export default new AIService(); 