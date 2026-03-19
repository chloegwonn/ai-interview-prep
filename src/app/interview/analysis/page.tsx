'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Play, Loader2, AlertCircle } from 'lucide-react';
import ResumeHighlights from '@/components/InterviewAnalysis/ResumeHighlights';
import RedFlags from '@/components/InterviewAnalysis/RedFlags';
import StrategyTips from '@/components/InterviewAnalysis/StrategyTips';
import { ResumeAnalysis } from '@/types/interview';
import { analyzeResume } from '@/lib/gemini';
import { extractTextFromPDF } from '@/lib/pdf-parser';

export default function AnalysisPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
console.log('analysis',analysis)
  useEffect(() => {
    analyzeResumeData();
  }, []);

  const analyzeResumeData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get setup data from sessionStorage
      const setupData = sessionStorage.getItem('interviewSetup');
      if (!setupData) {
        throw new Error('No interview setup data found');
      }

const setup = JSON.parse(setupData);

if (!setup.resumeData) {
  setTimeout(() => {
    setAnalysis(getMockAnalysis());
    setIsLoading(false);
  }, 2000);
  return;
}

const resumeText = await extractTextFromPDF(setup.resumeData);
      
      // Analyze with Gemini
      const result = await analyzeResume(
        resumeText,
        setup.role || 'Software Developer',
        setup.experience || '3-5'
      );

      setAnalysis(result);
      setIsLoading(false);
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err instanceof Error ? err.message : 'Failed to analyze resume');
      
      // Fallback to mock data on error
      setAnalysis(getMockAnalysis());
      setIsLoading(false);
    }
  };

  const getMockAnalysis = (): ResumeAnalysis => ({
    highlights: [
      '3 years experience across 3 different sectors (Fintech, Healthcare, E-commerce)',
      'Led team of 2 junior developers at ShopFlow Inc.',
      'Built HIPAA-compliant systems handling 50K+ active users',
      'Processed $2M+ monthly payment volume at PayTech Financial',
      'Reduced page load time by 60% through optimization',
      'Improved code coverage from 40% to 85%',
      'AWS Certified Solutions Architect - Associate'
    ],
    redFlags: [
      {
        issue: 'Short tenure at PayTech Financial (8 months)',
        followUp: 'What made you transition from fintech to healthcare?'
      },
      {
        issue: 'Jumped from Junior to Senior role in 2 years',
        followUp: 'How did you level up from Junior to Senior so quickly?'
      },
      {
        issue: 'GraphQL listed but no specific project examples in resume',
        followUp: 'Can you describe a project where you used GraphQL and why you chose it?'
      },
      {
        issue: 'Kubernetes mentioned but deployment details unclear',
        followUp: 'What was your role in the Kubernetes deployment at ShopFlow?'
      }
    ],
    strategyTips: {
      strengths: [
        'Lead with your healthcare/fintech experience (domain knowledge is valuable)',
        'Emphasize quantifiable metrics (60% speed improvement, 85% coverage)',
        'Highlight your quick progression to senior role and leadership experience'
      ],
      pitfalls: [
        "Don't just list technologies - explain WHY you chose them",
        'Prepare specific numbers and context for all "impact" questions',
        'Be ready to explain the short tenure at PayTech positively'
      ],
      powerPhrases: [
        'In healthcare, we had to ensure HIPAA compliance while maintaining performance...',
        'I reduced page load time by 60% by implementing code splitting and lazy loading...',
        'When mentoring junior developers, I learned the importance of...'
      ]
    }
  });

  const handleStartInterview = () => {
    router.push('/interview/session');
  };

  const handleBack = () => {
    router.push('/interview/setup');
  };

  const handleRetry = () => {
    analyzeResumeData();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
          <div>
            <h2 className="text-xl font-semibold mb-2">Analyzing Your Resume...</h2>
            <p className="text-muted-foreground">AI is reading your experience and skills</p>
          </div>
        </div>
      </div>
    );
  }

  if (!analysis) return null;

  return (
    <div className="min-h-screen py-16 px-6 relative">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="mb-8 gap-2 hover:bg-card"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </Button>

        {error && (
          <div className="mb-8 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-amber-500 mb-1">Analysis Warning</p>
              <p className="text-sm text-muted-foreground">{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRetry}
                className="mt-2"
              >
                Retry Analysis
              </Button>
            </div>
          </div>
        )}

        <div className="text-center mb-12 animate-fadeInUp">
          <h1 className="text-4xl font-bold mb-4">
            Resume Analysis Complete
          </h1>
          <p className="text-lg text-muted-foreground">
            Here&apos;s what we found and how to prepare
          </p>
        </div>

        <div className="space-y-6 mb-12">
          <div className="animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
            <ResumeHighlights highlights={analysis.highlights} />
          </div>
          
          <div className="animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            <RedFlags flags={analysis.redFlags} />
          </div>
          
          <div className="animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
            <StrategyTips tips={analysis.strategyTips} />
          </div>
        </div>

        <div className="animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
          <Button
            size="lg"
            onClick={handleStartInterview}
            className="w-full h-16 rounded-2xl text-lg font-bold gap-3 shadow-[0_8px_24px_hsl(var(--primary)/0.3)] hover:shadow-[0_12px_32px_hsl(var(--primary)/0.3)] hover:-translate-y-0.5"
          >
            <Play className="w-6 h-6" />
            Start Interview
          </Button>
        </div>
      </div>
    </div>
  );
}