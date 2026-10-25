import { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown, Check, Search, X } from "lucide-react";

export default function SearchableLuxurySelect({
  id,
  label,
  value,
  options = [],
  onChange,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  disabled = false,
  error = "",
  searchable = true,
  style = {}
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Normalize options to [{ value, label }]
  const normalizedOptions = useMemo(() => {
    return options.map((opt) => {
      if (typeof opt === "string") {
        return { value: opt, label: opt };
      }
      return {
        value: opt.isoCode || opt.value || opt.name || "",
        label: opt.name || opt.label || opt.value || ""
      };
    });
  }, [options]);

  // Find selected label
  const selectedOption = useMemo(() => {
    return normalizedOptions.find((opt) => opt.value === value);
  }, [normalizedOptions, value]);

  const displayLabel = selectedOption ? selectedOption.label : placeholder;

  // Filtered options based on search query
  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return normalizedOptions;
    const q = searchQuery.toLowerCase().trim();
    return normalizedOptions.filter((opt) =>
      opt.label.toLowerCase().includes(q)
    );
  }, [normalizedOptions, searchQuery]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchQuery("");
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen, searchable]);

  // Escape key to close
  useEffect(() => {
    function handleKeyDown(e) {
      if (!isOpen) return;
      if (e.key === "Escape") {
        setIsOpen(false);
        setSearchQuery("");
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <div
      ref={dropdownRef}
      style={{
        position: "relative",
        width: "100%",
        zIndex: isOpen ? 60 : 1,
        ...style
      }}
    >
      {label && (
        <label
          htmlFor={id}
          style={{
            fontSize: "0.76rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            display: "block",
            marginBottom: "6px",
            color: "var(--foreground)"
          }}
        >
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        id={id}
        type="button"
        disabled={disabled}
        onClick={() => {
          if (!disabled) {
            setIsOpen((prev) => !prev);
            setSearchQuery("");
          }
        }}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        style={{
          width: "100%",
          minHeight: "44px",
          height: "44px",
          padding: "0 14px",
          border: error
            ? "1px solid #dc2626"
            : isOpen
              ? "1px solid var(--primary)"
              : "1px solid #EDE8DE",
          borderRadius: "6px",
          backgroundColor: disabled ? "#FAF9F6" : "#ffffff",
          color: !value
            ? "var(--muted-foreground)"
            : disabled
              ? "var(--muted-foreground)"
              : "var(--foreground)",
          fontSize: "0.9rem",
          fontWeight: value ? 500 : 400,
          cursor: disabled ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: isOpen && !error ? "0 0 0 1px var(--primary)" : "none",
          transition: "all 0.2s ease",
          outline: "none",
          boxSizing: "border-box",
          opacity: disabled ? 0.75 : 1
        }}
        onMouseEnter={(e) => {
          if (!disabled && !isOpen && !error) {
            e.currentTarget.style.borderColor = "#c4bcae";
          }
        }}
        onMouseLeave={(e) => {
          if (!disabled && !isOpen && !error) {
            e.currentTarget.style.borderColor = "#EDE8DE";
          }
        }}
      >
        <span
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            textAlign: "left",
            fontFamily: "var(--font-sans)"
          }}
        >
          {displayLabel}
        </span>
        <ChevronDown
          size={16}
          style={{
            color: disabled ? "#b0b0b0" : "var(--muted-foreground)",
            flexShrink: 0,
            marginLeft: "8px",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)"
          }}
        />
      </button>

      {/* Floating Dropdown Menu */}
      {isOpen && !disabled && (
        <div
          role="listbox"
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            width: "100%",
            backgroundColor: "#ffffff",
            border: "1px solid #EDE8DE",
            borderRadius: "10px",
            boxShadow: "0 14px 35px rgba(0, 0, 0, 0.14), 0 2px 8px rgba(0, 0, 0, 0.04)",
            zIndex: 100,
            overflow: "hidden",
            boxSizing: "border-box"
          }}
        >
          {/* Search Box if list has more than 6 items */}
          {searchable && normalizedOptions.length > 6 && (
            <div
              style={{
                padding: "8px",
                borderBottom: "1px solid #EDE8DE",
                backgroundColor: "#FAF9F6"
              }}
            >
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center"
                }}
              >
                <Search
                  size={14}
                  style={{
                    position: "absolute",
                    left: "10px",
                    color: "var(--muted-foreground)",
                    pointerEvents: "none"
                  }}
                />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={searchPlaceholder}
                  style={{
                    width: "100%",
                    height: "36px",
                    padding: "0 30px 0 32px",
                    border: "1px solid #EDE8DE",
                    borderRadius: "6px",
                    backgroundColor: "#ffffff",
                    fontSize: "0.85rem",
                    outline: "none",
                    boxSizing: "border-box",
                    fontFamily: "var(--font-sans)"
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "var(--primary)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#EDE8DE";
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSearchQuery("");
                      searchInputRef.current?.focus();
                    }}
                    style={{
                      position: "absolute",
                      right: "8px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "2px",
                      color: "var(--muted-foreground)"
                    }}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Options List */}
          <div
            className="no-scrollbar"
            style={{
              maxHeight: "220px",
              overflowY: "auto",
              padding: "6px"
            }}
          >
            {filteredOptions.length === 0 ? (
              <div
                style={{
                  padding: "14px 12px",
                  fontSize: "0.84rem",
                  color: "var(--muted-foreground)",
                  textAlign: "center"
                }}
              >
                No options found
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <div
                    key={opt.value}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                      setSearchQuery("");
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px 12px",
                      borderRadius: "6px",
                      fontSize: "0.86rem",
                      fontWeight: isSelected ? 600 : 400,
                      color: isSelected ? "var(--primary)" : "var(--foreground)",
                      backgroundColor: isSelected ? "var(--primary-soft)" : "transparent",
                      cursor: "pointer",
                      transition: "background-color 0.15s ease",
                      fontFamily: "var(--font-sans)",
                      boxSizing: "border-box",
                      minHeight: "38px"
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = "#F4F6F0";
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <span
                      style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis"
                      }}
                    >
                      {opt.label}
                    </span>
                    {isSelected && (
                      <Check
                        size={15}
                        style={{
                          color: "var(--primary)",
                          flexShrink: 0,
                          marginLeft: "8px"
                        }}
                      />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {error && (
        <p style={{ color: "#dc2626", fontSize: "0.75rem", marginTop: "4px" }}>
          {error}
        </p>
      )}
    </div>
  );
}
