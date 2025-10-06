"use client";

import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface GitHubCommitActivity {
  total: number;
  week: number;
  days: number[];
}

interface GitHubChartProps {
  commitActivity: GitHubCommitActivity[];
  className?: string;
}

export function GitHubChart({
  commitActivity,
  className = "",
}: GitHubChartProps) {
  const chartData = useMemo(() => {
    if (!commitActivity || commitActivity.length === 0) return [];

    // Use all available data (3 years = 156 weeks)
    const allWeeks = commitActivity;

    // Find the maximum commits in a single day for normalization
    const maxCommits = Math.max(
      ...allWeeks.flatMap((week) => week.days),
      1, // Ensure we don't divide by zero
    );

    return allWeeks.map((week) => ({
      ...week,
      normalizedDays: week.days.map((day) => day / maxCommits),
      maxDayCommits: Math.max(...week.days),
    }));
  }, [commitActivity]);

  const totalCommits = useMemo(() => {
    return commitActivity.reduce((sum, week) => sum + week.total, 0);
  }, [commitActivity]);

  const getIntensityColor = (intensity: number) => {
    if (intensity === 0) return "bg-gray-100 dark:bg-gray-800";
    if (intensity < 0.25) return "bg-green-200 dark:bg-green-900";
    if (intensity < 0.5) return "bg-green-300 dark:bg-green-700";
    if (intensity < 0.75) return "bg-green-400 dark:bg-green-600";
    return "bg-green-500 dark:bg-green-500";
  };

  if (chartData.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>GitHub Activity</CardTitle>
          <CardDescription>No commit data available</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            Loading commit activity...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>GitHub Activity</CardTitle>
        <CardDescription>
          {totalCommits} commits over the past 3 years
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Chart */}
          <div className="flex items-end space-x-0.5 overflow-x-auto pb-2">
            {chartData.map((week, weekIndex) => (
              <div
                key={weekIndex}
                className="flex flex-col space-y-0.5 min-w-[6px]"
              >
                {week.days.map((day, dayIndex) => (
                  <div
                    key={dayIndex}
                    className={`w-1.5 h-1.5 rounded-sm ${getIntensityColor(
                      week.normalizedDays[dayIndex],
                    )}`}
                    title={`${day} commits - Week ${weekIndex + 1}`}
                  />
                ))}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Less</span>
            <div className="flex space-x-1">
              <div className="w-1.5 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-sm" />
              <div className="w-1.5 h-1.5 bg-green-200 dark:bg-green-900 rounded-sm" />
              <div className="w-1.5 h-1.5 bg-green-300 dark:bg-green-700 rounded-sm" />
              <div className="w-1.5 h-1.5 bg-green-400 dark:bg-green-600 rounded-sm" />
              <div className="w-1.5 h-1.5 bg-green-500 dark:bg-green-500 rounded-sm" />
            </div>
            <span>More</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
