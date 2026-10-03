import React from 'react';
import { TelemetryCards } from './TelemetryCards';
import { ExpenditureCrystal3D } from './ExpenditureCrystal3D';
import { ChronoFeed } from './ChronoFeed';
import { FastTelemetryLogger } from './FastTelemetryLogger';

export const DashboardView: React.FC = () => {
  return (
    <div className="space-y-4">
      {/* Top 4 Metric Cards */}
      <TelemetryCards />

      {/* Main Grid: Left 3D Geometry + Feed, Right Logger */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-7 space-y-4">
          <ExpenditureCrystal3D />
          <ChronoFeed />
        </div>
        <div className="lg:col-span-5">
          <FastTelemetryLogger />
        </div>
      </div>
    </div>
  );
};
