'use client';
import { useState } from 'react';
import type { Quiz } from '@/lib/lms/types';
import { Clock, CheckCircle2, XCircle, Award, ArrowRight, RotateCcw } from 'lucide-react';

export default function QuizRunner({ quiz, onClose }: { quiz: Quiz; onClose?:()=>void }){
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number[]>>({});
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft] = useState(quiz.durationMin*60);

  const q = quiz.questions[idx];
  const toggle = (qi:number)=>{
    const cur = answers[q.id] || [];
    if(q.type==='single'){
      setAnswers(a=>({...a, [q.id]:[qi]}));
    } else {
      setAnswers(a=>{
        const has = cur.includes(qi);
        const next = has ? cur.filter(x=>x!==qi) : [...cur, qi];
        return {...a, [q.id]: next};
      });
    }
  };

  const score = (()=> {
    let s=0;
    quiz.questions.forEach(qu=>{
      const ans = answers[qu.id]||[];
      const correct = qu.correctIndices.slice().sort().join(',')===ans.slice().sort().join(',');
      if(correct) s+= qu.marks;
    });
    return s;
  })();
  const percent = Math.round((score/quiz.totalMarks)*100);
  const passed = percent >= quiz.passPercent;

  if(submitted){
    return (
      <div className="bg-white rounded-[20px] border border-neutral-200 p-6 sm:p-8 max-w-2xl mx-auto">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto ${passed?'bg-emerald-500':'bg-amber-500'}`}>{passed?<Award className="w-8 h-8 text-white"/>:<XCircle className="w-8 h-8 text-white"/>}</div>
        <h3 className="text-center text-[22px] font-black mt-4">{passed?'Excellent!':'Keep practicing!'}</h3>
        <p className="text-center text-sm text-neutral-500 mt-1">You scored {score}/{quiz.totalMarks} • {percent}% • {passed?'Passed':'Need '+quiz.passPercent+'% to pass'}</p>
        <div className="mt-6 grid grid-cols-3 gap-3 text-center">
          <div className="bg-neutral-50 rounded-2xl p-3"><div className="text-[11px] font-bold text-neutral-500">SCORE</div><div className="text-xl font-black">{score}</div></div>
          <div className="bg-neutral-50 rounded-2xl p-3"><div className="text-[11px] font-bold text-neutral-500">ACCURACY</div><div className="text-xl font-black">{percent}%</div></div>
          <div className="bg-neutral-50 rounded-2xl p-3"><div className="text-[11px] font-bold text-neutral-500">TIME</div><div className="text-xl font-black">{quiz.durationMin}m</div></div>
        </div>
        <div className="mt-6 space-y-3">
          {quiz.questions.map((qu,i)=>{
            const ans = answers[qu.id]||[];
            const correct = qu.correctIndices.slice().sort().join(',')===ans.slice().sort().join(',');
            return (
              <div key={qu.id} className={`border rounded-2xl p-4 ${correct?'border-emerald-200 bg-emerald-50':'border-red-200 bg-red-50'}`}>
                <div className="flex gap-2">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${correct?'bg-emerald-600 text-white':'bg-red-600 text-white'}`}>{correct?<CheckCircle2 className="w-4 h-4"/>:<XCircle className="w-4 h-4"/>}</span>
                  <div className="flex-1">
                    <div className="text-sm font-bold">Q{i+1}. {qu.question}</div>
                    <div className="mt-2 grid gap-1.5">
                      {qu.options.map((op,oi)=>{
                        const isSelected = ans.includes(oi);
                        const isCorrect = qu.correctIndices.includes(oi);
                        return <div key={oi} className={`text-xs px-3 py-2 rounded-full border ${isCorrect?'bg-emerald-600 text-white border-emerald-600': isSelected?'bg-red-100 border-red-300':'bg-white border-neutral-200'}`}>{op} {isCorrect?'✓':''}</div>;
                      })}
                    </div>
                    {qu.explanation && <div className="mt-2 text-xs bg-white border border-neutral-200 rounded-xl p-2.5"><b>Explanation:</b> {qu.explanation}</div>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-6 flex gap-3">
          <button onClick={()=>{setSubmitted(false); setIdx(0); setAnswers({});}} className="flex-1 h-11 rounded-full border border-neutral-300 font-bold flex items-center justify-center gap-2"><RotateCcw className="w-4 h-4"/> Retry</button>
          <button onClick={onClose} className="flex-1 h-11 rounded-full bg-[#0f172a] text-white font-black">Continue learning</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[20px] border border-neutral-200 overflow-hidden max-w-3xl mx-auto">
      <div className="h-14 px-4 sm:px-5 flex items-center justify-between border-b border-neutral-100 bg-neutral-50">
        <div>
          <div className="text-sm font-black">{quiz.title}</div>
          <div className="text-[11px] text-neutral-500">Question {idx+1} of {quiz.questions.length} • {quiz.totalMarks} marks</div>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden sm:flex items-center gap-1.5 bg-white border border-neutral-200 px-3 py-1.5 rounded-full text-xs font-bold"><Clock className="w-3.5 h-3.5"/> {Math.floor(timeLeft/60)}:{String(timeLeft%60).padStart(2,'0')}</span>
          <button onClick={()=>setSubmitted(true)} className="bg-emerald-600 text-white px-4 py-1.5 rounded-full text-xs font-black hover:bg-emerald-700">Submit</button>
        </div>
      </div>
      <div className="h-1.5 bg-neutral-100">
        <div className="h-full bg-[#0f172a] transition-all" style={{width: `${((idx+1)/quiz.questions.length)*100}%`}}/>
      </div>
      <div className="p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <span className="w-8 h-8 rounded-full bg-[#0f172a] text-white flex items-center justify-center text-xs font-black shrink-0">{idx+1}</span>
          <h3 className="text-[16px] font-bold leading-snug flex-1">{q.question}</h3>
          <span className="text-[11px] font-black bg-amber-100 text-amber-800 px-2 py-1 rounded-full">{q.marks} marks</span>
        </div>
        <div className="mt-5 grid gap-2.5">
          {q.options.map((op,oi)=>{
            const selected = (answers[q.id]||[]).includes(oi);
            return (
              <button key={oi} onClick={()=>toggle(oi)} className={`text-left px-4 py-3 rounded-2xl border-2 flex items-center gap-3 transition ${selected ? 'border-[#4338ca] bg-[#eef2ff]':'border-neutral-200 hover:border-neutral-300 bg-white'}`}>
                <span className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-black shrink-0 ${selected?'bg-[#4338ca] border-[#4338ca] text-white':'border-neutral-300 bg-white'}`}>{String.fromCharCode(65+oi)}</span>
                <span className="text-[14px] font-medium flex-1">{op}</span>
                {selected && <CheckCircle2 className="w-5 h-5 text-[#4338ca]"/>}
              </button>
            );
          })}
        </div>
        <div className="mt-6 flex items-center justify-between">
          <button disabled={idx===0} onClick={()=>setIdx(i=>i-1)} className="h-10 px-5 rounded-full border border-neutral-300 font-bold text-sm disabled:opacity-40 hover:bg-neutral-50">Previous</button>
          {idx < quiz.questions.length-1 ? (
            <button onClick={()=>setIdx(i=>i+1)} className="h-10 px-6 rounded-full bg-[#0f172a] text-white font-black text-sm flex items-center gap-2 hover:bg-black">Next <ArrowRight className="w-4 h-4"/></button>
          ) : (
            <button onClick={()=>setSubmitted(true)} className="h-10 px-6 rounded-full bg-emerald-600 text-white font-black text-sm hover:bg-emerald-700">Submit quiz</button>
          )}
        </div>
      </div>
    </div>
  );
}
