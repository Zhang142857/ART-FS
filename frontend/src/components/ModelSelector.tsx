
import React, { useState, useMemo } from 'react';
import { useSettings } from '../hooks/useSettings';
import { useDebounce } from '../hooks/useDebounce';

interface ModelSelectorProps {
  value: string;
  onChange: (modelId: string) => void;
  provider?: string;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ value, onChange, provider }) => {
  const { models, isLoading } = useSettings();
  const categories = useMemo(() => {
    if (!models) return [];
    const categorySet = new Set(models.map(model => model.category));
    return Array.from(categorySet);
  }, [models]);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredModels = useMemo(() => {
    if (!models) return [];
    return models.filter(model =>
      model.id.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [models, debouncedSearchTerm]);

  return (
    <div style={{ position: 'relative' }}>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        placeholder="Search models..."
        style={{ width: '100%', padding: '8px' }}
      />
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          border: '1px solid #ccc',
          maxHeight: '200px',
          overflowY: 'auto',
          backgroundColor: 'white',
          zIndex: 1,
        }}>
          <div style={{
            display: 'flex',
            borderBottom: '1px solid #ccc',
            padding: '8px',
          }}>
            <div
              onClick={() => setSelectedCategory(null)}
              style={{
                padding: '8px',
                cursor: 'pointer',
                borderBottom: selectedCategory === null ? '2px solid blue' : 'none',
              }}
            >
              All
            </div>
            {categories && Object.keys(categories).map(category => (
              <div
                key={category}
                onClick={() => setSelectedCategory(category)}
                style={{
                  padding: '8px',
                  cursor: 'pointer',
                  borderBottom: selectedCategory === category ? '2px solid blue' : 'none',
                }}
              >
                {category}
              </div>
            ))}
          </div>
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            filteredModels.map(model => (
              <div
                key={model.id}
                onClick={() => {
                  onChange(model.id);
                  setSearchTerm('');
                  setIsOpen(false);
                }}
                style={{
                  padding: '8px',
                  cursor: 'pointer',
                  backgroundColor: model.id === value ? '#eee' : 'transparent',
                }}
              >
                {model.name}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ModelSelector;
