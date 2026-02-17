import React from 'react';
import { ArrowUp, ArrowRight, ArrowLeft, Navigation2 } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

const getDirectionIcon = (instruction) => {
  if (instruction.includes('straight') || instruction.includes('continue')) return ArrowUp;
  if (instruction.includes('right')) return ArrowRight;
  if (instruction.includes('left')) return ArrowLeft;
  return Navigation2;
};

export default function TurnByTurn({ instructions, currentStep }) {
  if (!instructions || instructions.length === 0) return null;

  const current = instructions[currentStep] || instructions[0];
  const next = instructions[currentStep + 1];
  const Icon = getDirectionIcon(current.instruction);

  return (
    <Card className="border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-white">
      <CardContent className="p-4">
        {/* Current Instruction */}
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shrink-0">
            <Icon className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-indigo-600 font-semibold uppercase tracking-wider mb-1">
              In {current.distance}
            </p>
            <p className="text-lg font-bold text-gray-900">{current.instruction}</p>
          </div>
        </div>

        {/* Next Instruction Preview */}
        {next && (
          <div className="pt-4 border-t border-indigo-100">
            <p className="text-xs text-gray-500 mb-2">THEN</p>
            <div className="flex items-center gap-2">
              {React.createElement(getDirectionIcon(next.instruction), { 
                className: "w-4 h-4 text-gray-400" 
              })}
              <p className="text-sm text-gray-600">{next.instruction}</p>
            </div>
          </div>
        )}

        {/* Progress */}
        <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
          <div className="flex-1 bg-gray-200 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-indigo-600 h-full transition-all duration-500"
              style={{ width: `${((currentStep + 1) / instructions.length) * 100}%` }}
            />
          </div>
          <span className="font-medium">{currentStep + 1}/{instructions.length}</span>
        </div>
      </CardContent>
    </Card>
  );
}