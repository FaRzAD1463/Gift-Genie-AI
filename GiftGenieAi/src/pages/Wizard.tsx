import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowLeft, Gift, User, DollarSign, MapPin, Sparkles, Wand2 } from 'lucide-react'
import { toast } from 'react-hot-toast'

const STEPS = [
  { id: 'recipient', title: 'Who is it for?', icon: User },
  { id: 'occasion', title: 'What is the occasion?', icon: Gift },
  { id: 'budget', title: 'What is your budget?', icon: DollarSign },
  { id: 'interests', title: 'What do they love?', icon: Sparkles },
  { id: 'location', title: 'Shipping to?', icon: MapPin },
]

export default function Wizard() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    recipient: '',
    age: '',
    occasion: '',
    budget: '',
    interests: '',
    location: '',
  })
  const navigate = useNavigate()

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      // Final step - Submit and redirect to results
      if (!formData.recipient || !formData.budget || !formData.interests) {
        toast.error('Please fill in all the magic details!')
        return
      }
      navigate({
        to: '/results',
        search: {
          recipient: formData.recipient,
          age: formData.age,
          occasion: formData.occasion,
          budget: formData.budget,
          interests: formData.interests,
          location: formData.location,
        }
      })
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const step = STEPS[currentStep]
  const Icon = step.icon

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 bg-secondary/10">
      <div className="max-w-2xl w-full">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-bold text-primary tracking-widest uppercase">Step {currentStep + 1} of {STEPS.length}</span>
            <span className="text-sm text-muted-foreground">{step.title}</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
              className="h-full bg-primary"
            />
          </div>
        </div>

        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4 }}
          className="bg-background rounded-3xl p-8 md:p-12 shadow-2xl magic-shadow border border-primary/10 relative overflow-hidden"
        >
          {/* Subtle background icon */}
          <Icon className="absolute -bottom-8 -right-8 h-48 w-48 text-primary/5 rotate-12" />

          <div className="relative z-10">
            <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 ring-1 ring-primary/20">
              <Icon className="h-6 w-6" />
            </div>
            
            <h2 className="font-display text-3xl font-bold mb-8">{step.title}</h2>

            {currentStep === 0 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold mb-2 uppercase tracking-wide text-muted-foreground">Recipient Name/Type</label>
                  <input
                    type="text"
                    placeholder="e.g. My Sister, Best Friend, Tech Enthusiast..."
                    value={formData.recipient}
                    onChange={(e) => updateFormData('recipient', e.target.value)}
                    className="w-full bg-secondary/30 border-2 border-transparent focus:border-primary focus:bg-background rounded-xl px-6 py-4 text-lg outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 uppercase tracking-wide text-muted-foreground">Approximate Age (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. 25, Newborn, Teenager..."
                    value={formData.age}
                    onChange={(e) => updateFormData('age', e.target.value)}
                    className="w-full bg-secondary/30 border-2 border-transparent focus:border-primary focus:bg-background rounded-xl px-6 py-4 text-lg outline-none transition-all"
                  />
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="grid grid-cols-2 gap-4">
                {['Birthday', 'Anniversary', 'Christmas', 'Graduation', 'Wedding', 'Just Because'].map((occ) => (
                  <button
                    key={occ}
                    onClick={() => updateFormData('occasion', occ)}
                    className={`p-6 rounded-2xl border-2 transition-all font-bold text-lg ${formData.occasion === occ ? 'border-primary bg-primary/5 text-primary scale-[1.02]' : 'border-secondary hover:border-primary/20 hover:bg-secondary/50'}`}
                  >
                    {occ}
                  </button>
                ))}
                <input
                  type="text"
                  placeholder="Other occasion..."
                  value={formData.occasion}
                  onChange={(e) => updateFormData('occasion', e.target.value)}
                  className="col-span-2 mt-4 bg-secondary/30 border-2 border-transparent focus:border-primary focus:bg-background rounded-xl px-6 py-4 text-lg outline-none transition-all"
                />
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  {['Under $25', '$25 - $50', '$50 - $100', '$100 - $250', '$250+', 'Any Budget'].map((range) => (
                    <button
                      key={range}
                      onClick={() => updateFormData('budget', range)}
                      className={`p-6 rounded-2xl border-2 transition-all font-bold text-lg ${formData.budget === range ? 'border-primary bg-primary/5 text-primary scale-[1.02]' : 'border-secondary hover:border-primary/20 hover:bg-secondary/50'}`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <p className="text-muted-foreground text-sm italic">List a few things they love or hobbies they have.</p>
                <textarea
                  rows={4}
                  placeholder="Cooking, hiking, photography, vintage vinyl, cats, cozy blankets..."
                  value={formData.interests}
                  onChange={(e) => updateFormData('interests', e.target.value)}
                  className="w-full bg-secondary/30 border-2 border-transparent focus:border-primary focus:bg-background rounded-xl px-6 py-4 text-lg outline-none transition-all resize-none"
                />
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <label className="block text-sm font-bold mb-2 uppercase tracking-wide text-muted-foreground">City and Country</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g. New York, USA"
                    value={formData.location}
                    onChange={(e) => updateFormData('location', e.target.value)}
                    className="w-full bg-secondary/30 border-2 border-transparent focus:border-primary focus:bg-background rounded-xl px-6 py-4 pl-14 text-lg outline-none transition-all"
                  />
                  <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/60 h-6 w-6" />
                </div>
              </div>
            )}

            <div className="flex items-center justify-between mt-12 gap-4">
              <button
                onClick={handleBack}
                disabled={currentStep === 0}
                className="px-8 py-4 rounded-xl border border-secondary font-bold flex items-center gap-2 hover:bg-secondary/50 disabled:opacity-0 transition-all"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              <button
                onClick={handleNext}
                className="flex-1 bg-primary text-primary-foreground px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:magic-glow transition-all hover:scale-[1.02] active:scale-95 shadow-lg group"
              >
                {currentStep === STEPS.length - 1 ? (
                  <>
                    <Wand2 className="h-5 w-5 group-hover:animate-bounce" /> Find Magical Gifts
                  </>
                ) : (
                  <>
                    Next <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}