// Performance monitoring utility for tracking component render times and performance metrics

import React from "react";

interface PerformanceMetrics {
  componentName: string;
  renderTime: number;
  timestamp: number;
  props: any;
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetrics[] = [];
  private isEnabled: boolean = process.env.NODE_ENV === "development";

  private constructor() {}

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  startTimer(componentName: string, props?: any): () => void {
    if (!this.isEnabled) return () => {};

    const startTime = performance.now();

    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;

      this.metrics.push({
        componentName,
        renderTime,
        timestamp: Date.now(),
        props: props ? JSON.stringify(props) : undefined,
      });

      // Log slow renders in development
      if (renderTime > 16) {
        // 16ms = 60fps threshold
        console.warn(
          `Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`
        );
      }
    };
  }

  getMetrics(): PerformanceMetrics[] {
    return [...this.metrics];
  }

  getAverageRenderTime(componentName?: string): number {
    const filteredMetrics = componentName
      ? this.metrics.filter((m) => m.componentName === componentName)
      : this.metrics;

    if (filteredMetrics.length === 0) return 0;

    const totalTime = filteredMetrics.reduce(
      (sum, metric) => sum + metric.renderTime,
      0
    );
    return totalTime / filteredMetrics.length;
  }

  clearMetrics(): void {
    this.metrics = [];
  }

  enable(): void {
    this.isEnabled = true;
  }

  disable(): void {
    this.isEnabled = false;
  }

  isMonitoringEnabled(): boolean {
    return this.isEnabled;
  }
}

// React Hook for performance monitoring
export const usePerformanceMonitor = (componentName: string, props?: any) => {
  const monitor = PerformanceMonitor.getInstance();

  React.useEffect(() => {
    const endTimer = monitor.startTimer(componentName, props);
    return endTimer;
  });
};

// Utility functions
export const measureFunction = <T extends (...args: any[]) => any>(
  fn: T,
  name: string
): T => {
  return ((...args: Parameters<T>): ReturnType<T> => {
    const monitor = PerformanceMonitor.getInstance();
    const endTimer = monitor.startTimer(name);

    try {
      const result = fn(...args);
      endTimer();
      return result;
    } catch (error) {
      endTimer();
      throw error;
    }
  }) as T;
};

export const getPerformanceMetrics = () => {
  const monitor = PerformanceMonitor.getInstance();
  return {
    metrics: monitor.getMetrics(),
    averageRenderTime: monitor.getAverageRenderTime(),
    isEnabled: monitor.isMonitoringEnabled(),
  };
};

export const clearPerformanceMetrics = () => {
  const monitor = PerformanceMonitor.getInstance();
  monitor.clearMetrics();
};

export default PerformanceMonitor.getInstance();
