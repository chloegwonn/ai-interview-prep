"use client";

import { useState } from "react";
import { Search, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface RoleSelectionProps {
  selectedRole?: string;
  onSelect: (role: string) => void;
  onContinue: () => void;
}

const POPULAR_ROLES = [
  "Software Engineer",
  "Product Manager",
  "Data Scientist",
  "UX Designer",
  "Marketing Manager",
  "Business Analyst",
  "DevOps Engineer",
  "Project Manager",
  "Sales Manager",
  "Financial Analyst",
  "HR Manager",
  "Consultant",
];

export default function RoleSelection({
  selectedRole,
  onSelect,
  onContinue,
}: RoleSelectionProps) {
  const [inputValue, setInputValue] = useState(selectedRole || "");
  const [filteredRoles, setFilteredRoles] = useState(POPULAR_ROLES);

  const handleInputChange = (value: string) => {
    setInputValue(value);
    onSelect(value);

    // Filter roles based on input
    const filtered = POPULAR_ROLES.filter((role) =>
      role.toLowerCase().includes(value.toLowerCase()),
    );
    setFilteredRoles(filtered);
  };

  const handleRoleClick = (role: string) => {
    setInputValue(role);
    onSelect(role);
  };

  return (
    <div className="w-full max-w-[900px] mx-auto animate-fadeInUp">
      <h2 className="text-2xl font-bold mb-2">
        What role are you preparing for?
      </h2>
      <p className="text-muted-foreground mb-8">
        Type any role or pick from popular ones
      </p>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="e.g. Software Engineer, Product Manager, Nurse..."
          className="pl-12 h-14 rounded-2xl bg-card border-border text-base focus-visible:ring-2 focus-visible:ring-primary"
        />
      </div>

      <div className="mb-8">
        <div className="text-[11px] font-semibold tracking-widest text-muted-foreground mb-4 font-mono">
          POPULAR ROLES
        </div>
        <div className="flex flex-wrap gap-2">
          {filteredRoles.map((role) => (
            <button
              key={role}
              onClick={() => handleRoleClick(role)}
              className={`
                px-4 py-2.5 rounded-full text-sm font-medium transition-all
                ${
                  selectedRole === role
                    ? "bg-primary text-primary-foreground border-2 border-primary"
                    : "bg-card text-foreground border-2 border-border hover:border-primary/50"
                }
              `}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      <Button
        size="lg"
        onClick={onContinue}
        disabled={!selectedRole}
        className="w-full h-14 rounded-2xl text-base font-semibold gap-2 shadow-[0_4px_16px_hsl(var(--primary)/0.3)] hover:shadow-[0_8px_24px_hsl(var(--primary)/0.3)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Continue as {selectedRole || "Role"}
        <ChevronRight className="w-5 h-5" />
      </Button>
    </div>
  );
}
