import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FilterControlsProps {
  selectedCompany: string;
  selectedVehicle: string;
  selectedEventType: string;
  onCompanyChange: (value: string) => void;
  onVehicleChange: (value: string) => void;
  onEventTypeChange: (value: string) => void;
  companies: string[];
  vehicles: string[];
  eventTypes: { value: string; label: string; }[];
}

export const FilterControls: React.FC<FilterControlsProps> = ({
  selectedCompany,
  selectedVehicle,
  selectedEventType,
  onCompanyChange,
  onVehicleChange,
  onEventTypeChange,
  companies,
  vehicles,
  eventTypes,
}) => {
  return (
    <div className="flex gap-4 mb-4">
      <Select value={selectedCompany} onValueChange={onCompanyChange}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="All companies" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All companies</SelectItem>
          {companies.map((company) => (
            <SelectItem key={company} value={company}>
              {company}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedVehicle} onValueChange={onVehicleChange}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="All vehicles" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All vehicles</SelectItem>
          {vehicles.map((vehicle) => (
            <SelectItem key={vehicle} value={vehicle}>
              {vehicle}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedEventType} onValueChange={onEventTypeChange}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="All events" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All events</SelectItem>
          {eventTypes.map((event) => (
            <SelectItem key={event.value} value={event.value}>
              {event.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};