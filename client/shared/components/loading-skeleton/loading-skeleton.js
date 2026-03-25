class LoadingSkeleton {
  static opportunity() {
    return `
      <div class="opportunity-skeleton">
        <div class="opportunity-amount-sk">
          <div class="skeleton-line skeleton-shimmer short" style="height: 24px;"></div>
          <div class="skeleton-line skeleton-shimmer medium" style="height: 16px;"></div>
        </div>
        <div class="opportunity-body-sk">
          <div class="skeleton-line skeleton-shimmer long" style="height: 28px; max-width: 400px;"></div>
          <div class="skeleton-line skeleton-shimmer medium" style="height: 16px; margin-top: 8px;"></div>
        </div>
        <div class="opportunity-deadline-sk">
          <div class="skeleton-icon skeleton-shimmer" style="width: 20px; height: 20px;"></div>
          <div class="skeleton-line skeleton-shimmer" style="width: 80px; height: 16px;"></div>
        </div>
      </div>
    `;
  }

  static training() {
    return `
      <div class="training-skeleton">
        <div class="training-skeleton__display skeleton-shimmer"></div>
        <div class="training-skeleton__body">
          <div class="training-skeleton__meta">
            <div class="skeleton-line skeleton-shimmer"></div>
            <div class="skeleton-line skeleton-shimmer"></div>
          </div>
          <div class="skeleton-line training-skeleton__title skeleton-shimmer"></div>
          <div class="skeleton-line training-skeleton__desc skeleton-shimmer"></div>
          <div class="skeleton-line training-skeleton__desc short skeleton-shimmer"></div>
        </div>
      </div>
    `;
  }

  static render(type, count = 3) {
    if (type === 'opportunity') {
      return Array.from({ length: count }).map(() => this.opportunity()).join('');
    } else if (type === 'training') {
      return Array.from({ length: count }).map(() => this.training()).join('');
    }
    return '';
  }
}

export default LoadingSkeleton;
