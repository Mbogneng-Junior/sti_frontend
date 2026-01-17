"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  User,
  Thermometer,
  Stethoscope,
  MapPin,
  Brain,
  Zap,
  Target,
  TrendingUp,
  Award,
  Heart,
  Activity,
  Clock
} from "lucide-react";

// Donnees simulees pour le quiz
const MOCK_QUIZ = [
  {
    id: 1,
    difficulty: "Beginner",
    difficultyColor: "bg-green-100 text-green-700",
    case: {
      title: "Fever and Chills",
      patient: { age: 24, sex: "M", profession: "Student", region: "Douala" },
      history: "Patient presenting with high fever (39.5C) for 2 days accompanied by intense chills and frontal headaches. Reports not sleeping under a mosquito net.",
      vitals: { temp: "39.5C", bp: "120/80", pulse: "95 bpm" }
    },
    question: "What is the most likely diagnosis to consider first?",
    options: [
      { id: "a", text: "Acute gastroenteritis" },
      { id: "b", text: "Simple malaria", correct: true },
      { id: "c", text: "Cerebrospinal meningitis" },
      { id: "d", text: "Typhoid fever" }
    ]
  },
  {
    id: 2,
    difficulty: "Intermediate",
    difficultyColor: "bg-amber-100 text-amber-700",
    case: {
      title: "Abdominal Pain and Fever",
      patient: { age: 45, sex: "F", profession: "Merchant", region: "West" },
      history: "Plateau fever for 1 week with diffuse abdominal pain and constipation. History of consuming untreated well water. Examination notes pulse-temperature dissociation.",
      vitals: { temp: "39C", bp: "110/70", pulse: "80 bpm (Dissociated)" }
    },
    question: "Which complementary examination is most relevant to confirm this diagnosis?",
    options: [
      { id: "a", text: "Thick blood smear alone" },
      { id: "b", text: "Abdominal ultrasound" },
      { id: "c", text: "Blood culture and Widal-Felix", correct: true },
      { id: "d", text: "Abdominopelvic CT scan" }
    ]
  },
  {
    id: 3,
    difficulty: "Advanced",
    difficultyColor: "bg-red-100 text-red-700",
    case: {
      title: "Altered Consciousness",
      patient: { age: 68, sex: "M", profession: "Retired", region: "North" },
      history: "Patient brought in for confusion and prostration. History of poorly controlled diabetes. Family reports rare urination. Examination reveals Kussmaul breathing.",
      vitals: { temp: "37.2C", bp: "90/60", glucose: "4.5 g/L" }
    },
    question: "What is your main diagnostic hypothesis and immediate priority?",
    options: [
      { id: "a", text: "Severe malaria - neurological form" },
      { id: "b", text: "Ischemic stroke" },
      { id: "c", text: "Diabetic ketoacidosis - Rehydration and Insulin", correct: true },
      { id: "d", text: "Hypoglycemic coma - Glucose administration" }
    ]
  }
];

// Composant pour une option de reponse
const OptionButton = ({
  letter,
  text,
  isSelected,
  onClick
}: {
  letter: string;
  text: string;
  isSelected: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 text-left group ${
      isSelected
        ? "border-blue-500 bg-blue-50 shadow-md"
        : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
    }`}
  >
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm transition-colors ${
      isSelected
        ? "bg-blue-500 text-white"
        : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
    }`}>
      {letter}
    </div>
    <span className={`flex-1 font-medium ${isSelected ? "text-blue-900" : "text-gray-700"}`}>
      {text}
    </span>
    {isSelected && (
      <CheckCircle2 className="h-5 w-5 text-blue-500" />
    )}
  </button>
);

// Composant pour les indicateurs de progression
const StepIndicator = ({
  step,
  currentStep,
  total
}: {
  step: number;
  currentStep: number;
  total: number;
}) => {
  const isCompleted = step < currentStep;
  const isCurrent = step === currentStep;

  return (
    <div className="flex items-center">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
        isCompleted
          ? "bg-blue-500 text-white"
          : isCurrent
            ? "bg-blue-500 text-white ring-4 ring-blue-100"
            : "bg-gray-200 text-gray-500"
      }`}>
        {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : step + 1}
      </div>
      {step < total - 1 && (
        <div className={`w-12 h-1 mx-1 rounded-full transition-colors ${
          isCompleted ? "bg-blue-500" : "bg-gray-200"
        }`} />
      )}
    </div>
  );
};

export default function ProfilingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = MOCK_QUIZ[currentStep];
  const progress = ((currentStep + 1) / MOCK_QUIZ.length) * 100;

  const handleSelectAnswer = (value: string) => {
    setAnswers({ ...answers, [currentStep]: value });
  };

  const handleNext = () => {
    if (currentStep < MOCK_QUIZ.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const calculateScore = () => {
    let score = 0;
    MOCK_QUIZ.forEach((q, index) => {
      const userAnswer = answers[index];
      const correctOption = q.options.find(opt => opt.correct);
      if (userAnswer === correctOption?.id) score++;
    });
    return score;
  };

  // Ecran de resultat
  if (isFinished) {
    const score = calculateScore();
    const percentage = Math.round((score / MOCK_QUIZ.length) * 100);
    const level = score === 3 ? "Expert" : score === 2 ? "Intermediate" : "Beginner";
    const levelColor = score === 3 ? "text-green-600" : score === 2 ? "text-amber-600" : "text-blue-600";

    const competencies = [
      { name: "Clinical Knowledge", score: score >= 2 ? 85 : 60, icon: Brain },
      { name: "Diagnostic Reasoning", score: score >= 1 ? 75 : 45, icon: Target },
      { name: "Critical Thinking", score: score === 3 ? 90 : 65, icon: Zap },
      { name: "Medical Decision Making", score: percentage, icon: TrendingUp }
    ];

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full space-y-6">
          {/* Header Card */}
          <Card className="border-0 shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white text-center">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                <Award className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Assessment Complete!</h1>
              <p className="text-blue-100">Your clinical proficiency has been evaluated</p>
            </div>

            <CardContent className="p-8">
              {/* Score Section */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gray-50 border-4 border-gray-100 mb-4">
                  <div>
                    <p className="text-4xl font-bold text-gray-900">{percentage}%</p>
                    <p className="text-sm text-gray-500">Score</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-2">Your recommended level is</p>
                <h2 className={`text-3xl font-bold ${levelColor}`}>{level}</h2>
              </div>

              {/* Competency Breakdown */}
              <div className="space-y-4 mb-8">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Competency Breakdown
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {competencies.map((comp) => (
                    <div key={comp.name} className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                          <comp.icon className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-700">{comp.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Progress value={comp.score} className="flex-1 h-2" />
                        <span className="text-sm font-semibold text-gray-900">{comp.score}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setIsFinished(false);
                    setCurrentStep(0);
                    setAnswers({});
                  }}
                >
                  Retake Assessment
                </Button>
                <Button
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  onClick={() => router.push("/learn")}
                >
                  Start Learning
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Ecran du quiz
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-gray-900">Skills Assessment</h1>
                <p className="text-xs text-gray-500">Clinical Diagnostic Module</p>
              </div>
            </div>

            {/* Step Indicators */}
            <div className="hidden md:flex items-center">
              {MOCK_QUIZ.map((_, index) => (
                <StepIndicator
                  key={index}
                  step={index}
                  currentStep={currentStep}
                  total={MOCK_QUIZ.length}
                />
              ))}
            </div>

            {/* Mobile Progress */}
            <div className="md:hidden flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600">
                {currentStep + 1}/{MOCK_QUIZ.length}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Left Column - Case Scenario */}
          <div className="lg:col-span-3">
            <Card className="border-0 shadow-lg overflow-hidden">
              {/* Case Header */}
              <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <Badge className={`${currentQuestion.difficultyColor} border-0`}>
                    {currentQuestion.difficulty}
                  </Badge>
                  <Badge variant="outline" className="bg-white/10 text-white border-white/20">
                    Case #{currentQuestion.id}
                  </Badge>
                </div>
                <h2 className="text-xl font-bold">{currentQuestion.case.title}</h2>
              </div>

              <CardContent className="p-6 space-y-6">
                {/* Patient Info */}
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg">
                    <User className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">
                      {currentQuestion.case.patient.age} yrs, {currentQuestion.case.patient.sex}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                    <Activity className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      {currentQuestion.case.patient.profession}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                    <MapPin className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      {currentQuestion.case.patient.region}
                    </span>
                  </div>
                </div>

                {/* History */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Stethoscope className="h-5 w-5 text-gray-400" />
                    <h3 className="font-semibold text-gray-900">Clinical History</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed text-lg bg-gray-50 p-4 rounded-xl border border-gray-100">
                    {currentQuestion.case.history}
                  </p>
                </div>

                {/* Vitals */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Vital Signs</h3>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                      <div className="flex items-center gap-2 mb-1">
                        <Thermometer className="h-4 w-4 text-red-500" />
                        <span className="text-xs font-medium text-red-600 uppercase">Temp</span>
                      </div>
                      <p className="text-lg font-bold text-red-900">{currentQuestion.case.vitals.temp}</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                      <div className="flex items-center gap-2 mb-1">
                        <Heart className="h-4 w-4 text-blue-500" />
                        <span className="text-xs font-medium text-blue-600 uppercase">BP</span>
                      </div>
                      <p className="text-lg font-bold text-blue-900">{currentQuestion.case.vitals.bp}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                      <div className="flex items-center gap-2 mb-1">
                        <Activity className="h-4 w-4 text-green-500" />
                        <span className="text-xs font-medium text-green-600 uppercase">Pulse</span>
                      </div>
                      <p className="text-lg font-bold text-green-900">
                        {currentQuestion.case.vitals.pulse || currentQuestion.case.vitals.glucose}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Question */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg sticky top-24">
              <CardContent className="p-6">
                {/* Question */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                    <Clock className="h-4 w-4" />
                    Question {currentStep + 1} of {MOCK_QUIZ.length}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 leading-relaxed">
                    {currentQuestion.question}
                  </h3>
                </div>

                {/* Options */}
                <div className="space-y-3 mb-8">
                  {currentQuestion.options.map((option, index) => (
                    <OptionButton
                      key={option.id}
                      letter={String.fromCharCode(65 + index)}
                      text={option.text}
                      isSelected={answers[currentStep] === option.id}
                      onClick={() => handleSelectAnswer(option.id)}
                    />
                  ))}
                </div>

                {/* Navigation */}
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentStep === 0}
                    className="flex-1"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Previous
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={!answers[currentStep]}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    {currentStep === MOCK_QUIZ.length - 1 ? "Finish" : "Next"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>

                {/* Progress Bar Mobile */}
                <div className="mt-6 lg:hidden">
                  <Progress value={progress} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
