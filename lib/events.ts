// Custom event system for real-time updates
export const EVENTS = {
  VEHICLE_ADDED: "vehicle-added",
  VEHICLE_INFO_ADDED: "vehicle-info-added",
  DATA_UPDATED: "data-updated",
} as const;

export class EventBus {
  private static listeners: { [key: string]: Function[] } = {};

  static subscribe(event: string, callback: Function) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);

    // Return unsubscribe function
    return () => {
      this.listeners[event] = this.listeners[event].filter(
        (cb) => cb !== callback
      );
    };
  }

  static publish(event: string, data?: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          console.error("Error in event callback:", error);
        }
      });
    }
  }

  static unsubscribe(event: string, callback: Function) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(
        (cb) => cb !== callback
      );
    }
  }
}
