"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useLocale } from "next-intl";
import { Building2, MapPin, Loader2 } from "lucide-react";
import { type SuggestionsData, type SuggestionProject, type SuggestionLocation } from "@/lib/nainahub";

interface SearchSuggestionsProps {
  searchText: string;
  onSelect: (value: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function SearchSuggestions({ searchText, onSelect, isOpen, onClose }: SearchSuggestionsProps) {
  const locale = useLocale();
  const useEnglish = locale === "en" || locale === "zh";

  const [suggestions, setSuggestions] = useState<SuggestionsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch suggestions on mount
  useEffect(() => {
    const fetchSuggestions = async () => {
      setLoading(true);
      setError(false);
      try {
        const response = await fetch("/api/nainahub/suggestions");
        const data = await response.json();
        if (data.success) {
          setSuggestions(data.data);
        } else {
          setError(true);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, []);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const getProjectName = useCallback((project: SuggestionProject) => {
    return useEnglish
      ? (project.nameEn || project.nameTh || "")
      : (project.nameTh || project.nameEn || "");
  }, [useEnglish]);

  const getLocationText = useCallback((location: SuggestionLocation) => {
    // For Thai: use text (projectLocationText for condo, propertyLocationText for others)
    // For other languages: use textEn if available
    return useEnglish
      ? (location.textEn || location.text || "")
      : (location.text || location.textEn || "");
  }, [useEnglish]);

  // Filter suggestions based on search text
  const filteredProjects = suggestions?.projects.filter((project) => {
    if (!searchText || searchText.length < 1) return true;
    const name = getProjectName(project).toLowerCase();
    const search = searchText.toLowerCase();
    return name.includes(search);
  }).slice(0, 3) || [];

  const filteredLocations = suggestions?.locations.filter((location) => {
    if (!searchText || searchText.length < 1) return true;
    const locationText = getLocationText(location);
    return locationText.toLowerCase().includes(searchText.toLowerCase());
  }).slice(0, 3) || [];

  const hasResults = filteredProjects.length > 0 || filteredLocations.length > 0;

  if (!isOpen) return null;

  return (
    <div
      ref={containerRef}
      className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-gray-200 z-999 overflow-hidden max-h-[400px] overflow-y-auto"
    >
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
        </div>
      ) : error ? (
        <div className="py-4 px-4 text-center text-gray-500 text-sm">
          Failed to load suggestions
        </div>
      ) : !hasResults ? (
        <div className="py-4 px-4 text-center text-gray-500 text-sm">
          No results found
        </div>
      ) : (
        <>
          {/* Projects Section */}
          {filteredProjects.length > 0 && (
            <div>
              <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" />
                  {locale === "th" ? "โครงการ" : "Projects"}
                </span>
              </div>
              <div>
                {filteredProjects.map((project, index) => (
                  <button
                    key={`project-${index}`}
                    onClick={() => {
                      onSelect(getProjectName(project));
                      onClose();
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 border-b border-gray-50 last:border-b-0"
                  >
                    <div className="w-8 h-8 bg-[#eb3838]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-4 h-4 text-[#eb3838]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {getProjectName(project)}
                      </p>
                      {useEnglish && project.nameTh && project.nameEn !== project.nameTh && (
                        <p className="text-xs text-gray-500 truncate">{project.nameTh}</p>
                      )}
                      {!useEnglish && project.nameEn && project.nameEn !== project.nameTh && (
                        <p className="text-xs text-gray-500 truncate">{project.nameEn}</p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Locations Section */}
          {filteredLocations.length > 0 && (
            <div>
              <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  {locale === "th" ? "ทำเล" : "Locations"}
                </span>
              </div>
              <div>
                {filteredLocations.map((location, index) => (
                  <button
                    key={`location-${index}`}
                    onClick={() => {
                      onSelect(getLocationText(location));
                      onClose();
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 border-b border-gray-50 last:border-b-0"
                  >
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {getLocationText(location)}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
