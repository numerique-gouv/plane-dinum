// types
import { TXAxisValues, TYAxisValues } from "types";

export const ANALYTICS_X_AXIS_VALUES: { value: TXAxisValues; label: string }[] = [
  {
    value: "state__name",
    label: "State name",
  },
  {
    value: "state__group",
    label: "State group",
  },
  {
    value: "priority",
    label: "Priority",
  },
  {
    value: "labels__name",
    label: "Label",
  },
  {
    value: "assignees__id",
    label: "Assignee",
  },
  {
    value: "estimate_point",
    label: "Estimate point",
  },
  {
    value: "issue_cycle__cycle__name",
    label: "Cycle",
  },
  {
    value: "issue_module__module__name",
    label: "Module",
  },
  {
    value: "completed_at",
    label: "Completed date",
  },
  {
    value: "target_date",
    label: "Due date",
  },
  {
    value: "start_date",
    label: "Start date",
  },
  {
    value: "created_at",
    label: "Created date",
  },
];

export const ANALYTICS_Y_AXIS_VALUES: { value: TYAxisValues; label: string }[] = [
  {
    value: "issue_count",
    label: "Issue Count",
  },
  {
    value: "estimate",
    label: "Estimate",
  },
];

export const DATE_KEYS = ["completed_at", "target_date", "start_date", "created_at"];
