# Sliding Window Feature - Frontend Integration

## Overview

The Job Scheduler now supports a **sliding time window** feature that allows you to fetch stock data for the last N days automatically. This window slides forward each day, always fetching the most recent data.

**Implementation Date:** October 23, 2025  
**Status:** ✅ Integrated  
**Backend Requirement:** Backend with sliding window support

---

## What's New

### New Field: `duration_days`

Instead of specifying fixed `start_date` and `end_date`, you can now specify a `duration_days` parameter:

- **Type:** Positive integer
- **Description:** Number of days to fetch from today
- **Examples:** 7 (week), 30 (month), 60 (bi-monthly), 90 (quarter), 365 (year)
- **Behavior:** Creates a sliding window that updates automatically

---

## User Interface Updates

### 1. Job Creation Dialog

**New UI Elements:**

- **Date Range Configuration** section with radio buttons:
  - **Fixed Date Range** - Use start_date and end_date
  - **Sliding Window** - Use duration_days

- **Conditional Form Fields:**
  - When "Fixed Date Range" is selected:
    - Start Date (optional)
    - End Date (optional)
  
  - When "Sliding Window" is selected:
    - Duration (Days) - Required positive integer

**Example UI:**

```
┌─────────────────────────────────────────────┐
│ Create Scheduled Job                        │
├─────────────────────────────────────────────┤
│ Job Name: [Daily Tech Stocks_____________]  │
│                                             │
│ Stock IDs: [AAPL] [MSFT] [GOOGL]          │
│                                             │
│ Schedule Time: [17:00]                      │
│                                             │
│ ┌─────────────────────────────────────────┐│
│ │ Date Range Configuration              ℹ││
│ │                                          ││
│ │ ○ Fixed Date Range                      ││
│ │ ● Sliding Window (Last N Days)          ││
│ └─────────────────────────────────────────┘│
│                                             │
│ Duration (Days): [60___________]            │
│ Number of days to fetch from today          │
│                                             │
│           [Cancel]  [Create Job]            │
└─────────────────────────────────────────────┘
```

### 2. Job Edit Dialog

**Same enhancements as Create Dialog:**

- Radio buttons to switch between fixed and sliding modes
- Pre-populated with current job configuration
- Shows current `duration_days` if job uses sliding window

### 3. Jobs Table

**New Column: "Date Range"**

Displays the date range configuration:

- **Sliding Window:** `Last 60 days` (blue chip, outlined)
- **Fixed Range:** Shows actual dates (e.g., `2025-01-01 to 2025-03-31`)
- **Default:** `Last 30 days` (gray chip, outlined)

**Example Table:**

```
┌─────────────────────────────────────────────────────────────────────┐
│ Name         │ Stocks │ Schedule │ Date Range     │ Status │ ...  │
├─────────────────────────────────────────────────────────────────────┤
│ Daily Tech   │ AAPL   │ 17:00    │ Last 60 days ⓘ │   ✅   │ ...  │
│              │ MSFT   │          │                │        │      │
│ Historical   │ GOOGL  │ 18:00    │ 2025-01-01     │   ⏸   │ ...  │
│              │        │          │ to 2025-03-31  │        │      │
│ Quick Fetch  │ META   │ 16:00    │ Last 30 days   │   ✅   │ ...  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## How It Works

### Fixed Date Range Mode (Original)

When "Fixed Date Range" is selected:

```javascript
{
  "name": "Q1 Analysis",
  "stock_ids": ["AAPL", "GOOGL"],
  "schedule_time": "17:00",
  "start_date": "2025-01-01",
  "end_date": "2025-03-31"
}
```

**Behavior:**
- Fetches data from Jan 1 to Mar 31, 2025
- Dates never change
- Good for historical analysis

### Sliding Window Mode (New)

When "Sliding Window" is selected:

```javascript
{
  "name": "60-Day Rolling",
  "stock_ids": ["AAPL", "GOOGL"],
  "schedule_time": "17:00",
  "duration_days": 60
}
```

**Behavior:**
- Day 1: Fetches [today - 60 days] to [today]
- Day 2: Fetches [today - 60 days] to [today] (automatically updated)
- Day 3: Fetches [today - 60 days] to [today] (automatically updated)
- Always maintains the last 60 days of data

---

## Common Use Cases

| Duration | Use Case | Description |
|----------|----------|-------------|
| 7 days | Weekly analysis | Last week's data |
| 30 days | Monthly trends | Last month's data |
| 60 days | Bi-monthly comparison | Last 2 months |
| 90 days | Quarterly analysis | Last quarter |
| 365 days | Annual trends | Last year |

---

## Validation Rules

### Client-Side Validation

**Valid Values:**
- Any positive integer: `1, 7, 30, 60, 90, 365, 1000, etc.`
- Required when "Sliding Window" is selected

**Invalid Values:**
- Zero: `0` → Error: "Duration days must be a positive number"
- Negative: `-10` → Error: "Duration days must be a positive number"
- Empty: `""` → Error: "Duration days must be a positive number"
- Non-integer: `"abc"` → Handled by HTML5 number input

### Backend Validation

The backend also validates the `duration_days` parameter:
- Must be a positive integer
- Returns 400 error if invalid

---

## Technical Implementation

### Updated Components

**1. JobCreationDialog.js**

Added:
- `useSlidingWindow` state to track mode
- `duration_days` field to formData
- Radio buttons for mode selection
- Conditional rendering of date fields
- Validation for duration_days
- Payload construction based on mode

**2. JobEditDialog.js**

Added:
- Same updates as JobCreationDialog
- Auto-detects mode from existing job
- Pre-populates duration_days if present

**3. JobsTable.js**

Added:
- New "Date Range" column
- Displays duration_days as chip
- Shows fixed dates if no duration
- Default "Last 30 days" indicator

### API Integration

The existing API functions already support `duration_days`:

```javascript
// Create job with sliding window
await createScheduledJob({
  name: "60-Day Rolling",
  stock_ids: ["AAPL", "GOOGL"],
  schedule_time: "17:00",
  duration_days: 60
});

// Update job to use sliding window
await updateScheduledJob(jobId, {
  duration_days: 90
});

// Update job to use fixed dates
await updateScheduledJob(jobId, {
  duration_days: null,
  start_date: "2025-01-01",
  end_date: "2025-03-31"
});
```

---

## Priority Logic

When both `duration_days` and `start_date` are present:

1. **Frontend:** Sends only the active mode's parameters
   - If "Sliding Window" selected: sends `duration_days`, removes `start_date`
   - If "Fixed Range" selected: sends `start_date`/`end_date`, removes `duration_days`

2. **Backend:** Prioritizes `duration_days` if present
   - If `duration_days` exists: uses sliding window
   - Otherwise: uses `start_date` or defaults to 30 days

---

## User Workflows

### Creating a Job with Sliding Window

1. Click "Create New Job"
2. Enter job name and stock symbols
3. Set schedule time
4. Select **"Sliding Window (Last N Days)"** radio button
5. Enter duration (e.g., 60)
6. Click "Create Job"

**Result:** Job will fetch the last 60 days of data automatically, every day.

### Converting Fixed Range to Sliding Window

1. Click Edit icon on existing job
2. Select **"Sliding Window (Last N Days)"** radio button
3. Enter duration
4. Click "Update Job"

**Result:** Job now uses sliding window instead of fixed dates.

### Converting Sliding Window to Fixed Range

1. Click Edit icon on job with sliding window
2. Select **"Fixed Date Range"** radio button
3. Enter start_date and end_date
4. Click "Update Job"

**Result:** Job now uses fixed dates instead of sliding window.

---

## Benefits

### For Users

✅ **Always Fresh Data** - Automatically maintains most recent N days  
✅ **No Manual Updates** - Set once, runs forever with current data  
✅ **Flexible Analysis** - Easy to adjust window size  
✅ **Moving Windows** - Perfect for technical indicators  
✅ **Trend Tracking** - Consistently compare equivalent time periods  

### For Developers

✅ **Clean UI** - Radio buttons make mode selection obvious  
✅ **Validation** - Client and server-side validation  
✅ **Backward Compatible** - Existing jobs continue to work  
✅ **Intuitive** - Clear visual distinction between modes  

---

## Testing Checklist

### Manual Testing

- [ ] Create job with fixed date range
- [ ] Create job with sliding window (60 days)
- [ ] Edit job to change from fixed to sliding
- [ ] Edit job to change from sliding to fixed
- [ ] Edit job to change duration (60 → 90 days)
- [ ] Verify table displays "Last N days" correctly
- [ ] Verify table displays fixed dates correctly
- [ ] Test validation (zero, negative, empty duration)
- [ ] Test with backend running
- [ ] Verify job executes with sliding window

### Edge Cases

- [ ] Job with no date configuration (should default to 30 days)
- [ ] Job with only duration_days
- [ ] Job with only start_date
- [ ] Job with both (backend should prioritize duration_days)
- [ ] Empty duration field (should show validation error)
- [ ] Very large duration (e.g., 3650 days / 10 years)

---

## Troubleshooting

### Issue: Duration days not showing in edit dialog

**Solution:** Check that the job response includes `duration_days` field. Refresh the jobs list.

### Issue: Validation error when creating job

**Solution:** Ensure duration_days is a positive integer. Check browser console for errors.

### Issue: Job still uses old start_date

**Solution:** When switching to sliding window, ensure the update payload sets `start_date: null` or removes it.

### Issue: Table shows "Last 30 days" for sliding window job

**Solution:** Verify the job response includes `duration_days`. Check API response in network tab.

---

## Future Enhancements

Potential improvements:

- [ ] Quick duration buttons (7, 30, 60, 90 days)
- [ ] Visual calendar to preview date range
- [ ] Business days only option
- [ ] Custom window types (last_month, last_quarter)
- [ ] Multiple windows per job
- [ ] Window offset (e.g., 60 days starting from 30 days ago)

---

## Related Documentation

- **Backend Implementation:** `/Users/pwang/Developer/stock-analyzer-backend/SLIDING_WINDOW_IMPLEMENTATION.md`
- **Backend Feature Guide:** `/Users/pwang/Developer/stock-analyzer-backend/SLIDING_WINDOW_FEATURE.md`
- **Backend Quick Reference:** `/Users/pwang/Developer/stock-analyzer-backend/SLIDING_WINDOW_QUICK_REF.md`
- **Job Scheduler Implementation:** `JOB_SCHEDULER_IMPLEMENTATION.md`
- **Feature Summary:** `NEW_FEATURE_SUMMARY.md`

---

**Status:** ✅ Implemented and Ready  
**Version:** 1.1.0  
**Last Updated:** October 23, 2025
