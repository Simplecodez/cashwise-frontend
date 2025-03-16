import { motion } from 'framer-motion';
import { HomeIcon, UserIcon, LockIcon, Check } from 'lucide-react';

interface IProgressProps {
  steps: number;
  currentStep: number;
}

const icons = [UserIcon, HomeIcon, LockIcon];

export function ProgressBar({ currentStep }: IProgressProps) {
  return (
    <div className="relative mb-6 flex w-full items-center">
      {/* Background Line */}
      <div className="absolute left-0 top-1/2 h-1 w-full -translate-y-1/2 bg-gray-300" />

      {/* Progress Line (Smooth Animation) */}
      <motion.div
        className="absolute left-0 top-1/2 h-1 rounded-full bg-emerald-500"
        style={{ width: `${(currentStep / (icons.length - 1)) * 100}%` }}
        initial={{ width: 0 }}
        animate={{ width: `${(currentStep / (icons.length - 1)) * 100}%` }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      />

      {/* Icons & Steps */}
      <div className="relative z-10 flex w-full justify-between">
        {icons.map((Icon, index) => {
          const isCompleted = currentStep > index;
          const isCurrent = currentStep === index;

          return (
            <motion.button
              key={index}
              className={`flex size-12 items-center justify-center rounded-full border-2 transition-all ${isCompleted ? 'border-emerald-600 bg-emerald-500' : ''} ${isCurrent ? 'border-emerald-400 bg-emerald-300' : ''} ${!isCompleted && !isCurrent ? 'border-gray-100 bg-gray-50' : ''}`}
              initial={{ rotateY: 0 }}
              animate={{ rotateY: isCompleted ? 180 : 0 }}
              transition={{ duration: 0.5 }}
            >
              {isCompleted ? (
                <motion.div
                  animate={{ rotateY: isCompleted ? 180 : 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Check className="text-gray-50" />
                </motion.div>
              ) : (
                <Icon
                  className={`${
                    isCurrent ? 'text-gray-50' : 'text-emerald-600'
                  } transition-colors`}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// interface IProgressProps {
//   steps: number;
//   currentStep: number;
// }

// export function ProgressBar({ steps, currentStep }: IProgressProps) {
//   const stepArray = Array.from({ length: steps }, (_, i) => i);
//   console.log(stepArray);
//   return (
//     <div className="mb-10 flex items-center gap-2">
//       {stepArray.map((s) => (
//         <motion.div
//           key={s}
//           className="h-2 flex-1 rounded-full"
//           initial={{ backgroundColor: '#D1D5DB' }}
//           animate={{
//             backgroundColor: s <= currentStep ? '#059669' : '#D1D5DB'
//           }}
//           transition={{ duration: 1 }}
//         />
//       ))}
//     </div>
//   );
// }
