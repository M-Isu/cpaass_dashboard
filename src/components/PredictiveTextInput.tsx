
import React, { useState, useRef, useEffect } from 'react';
import { getPredictiveText } from './predictiveText';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown, CornerDownLeft, Loader } from 'lucide-react';

interface PredictiveTextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  templates?: any[];
  className?: string;
  rows?: number;
}

export const PredictiveTextInput: React.FC<PredictiveTextInputProps> = ({
  value,
  onChange,
  placeholder = "Type your message here...",
  templates = [],
  className = "",
  rows = 5
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  const updateSuggestions = async (text: string) => {
    if (text.trim().length >= 2) {
      setIsGenerating(true);
      
      // Clear previous debounce
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      
      // Debounce the AI request
      debounceRef.current = setTimeout(async () => {
        try {
          const predictiveSuggestions = await getPredictiveText(text, templates);
          
          setSuggestions(predictiveSuggestions);
          setShowSuggestions(predictiveSuggestions.length > 0);
          setSelectedSuggestionIndex(0);
        } catch (error) {
          console.error('Error getting predictions:', error);
          setShowSuggestions(false);
        } finally {
          setIsGenerating(false);
        }
      }, 500); // 500ms debounce
    } else {
      setShowSuggestions(false);
      setIsGenerating(false);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    updateSuggestions(newValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Tab':
        e.preventDefault();
        applySuggestion(suggestions[selectedSuggestionIndex]);
        break;
      case 'Enter':
        if (!e.shiftKey) {
          e.preventDefault();
          applySuggestion(suggestions[selectedSuggestionIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        break;
    }
  };

  const applySuggestion = (suggestion: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    onChange(suggestion);
    setShowSuggestions(false);
    
    setTimeout(() => {
      if (textarea) {
        textarea.setSelectionRange(suggestion.length, suggestion.length);
        textarea.focus();
      }
    }, 0);
  };

  // Clean up debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        rows={rows}
        className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm leading-relaxed ${className}`}
        placeholder={placeholder}
        value={value}
        onChange={handleTextChange}
        onKeyDown={handleKeyDown}
        autoFocus
      />
      
      {(showSuggestions || isGenerating) && (
        <div className="absolute z-50 bg-white border border-gray-200 rounded-lg shadow-lg max-w-md w-full mt-1">
          <div className="p-2 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
            <span className="text-xs font-medium text-gray-600 flex items-center gap-1">
              {isGenerating && <Loader className="w-3 h-3 animate-spin" />}
              AI Generated Suggestions
            </span>
            <div className="flex items-center space-x-1 text-xs text-gray-400">
              <ArrowUp className="w-3 h-3" />
              <ArrowDown className="w-3 h-3" />
              <span>Navigate</span>
              <CornerDownLeft className="w-3 h-3" />
              <span>Tab to complete</span>
            </div>
          </div>
          
          {isGenerating ? (
            <div className="p-4 text-center text-sm text-gray-500">
              <Loader className="w-4 h-4 animate-spin mx-auto mb-2" />
              Generating suggestions...
            </div>
          ) : (
            <div className="max-h-48 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 border-l-2 transition-colors ${
                    index === selectedSuggestionIndex
                      ? 'bg-blue-50 border-l-blue-500 text-blue-900'
                      : 'border-l-transparent text-gray-700'
                  }`}
                  onClick={() => applySuggestion(suggestion)}
                  onMouseEnter={() => setSelectedSuggestionIndex(index)}
                >
                  <div className="truncate">{suggestion}</div>
                </button>
              ))}
            </div>
          )}
          
          <div className="p-2 border-t border-gray-100 bg-gray-50">
            <div className="text-xs text-gray-500 flex items-center space-x-2">
              <span>🤖 Powered by AI - Press Tab to complete</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
