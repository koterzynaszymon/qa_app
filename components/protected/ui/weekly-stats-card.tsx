import { getWeeklyQuestionStats } from "@/actions/questions";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function WeeklyStatsCard() {
  const { data, error } = await getWeeklyQuestionStats();

  if (error || !data) {
    return null;
  }

  return (
    <Card className="w-full max-w-xs">
      <CardHeader className="py-4">
        <CardDescription>Questions in the last 7 days</CardDescription>
        <CardTitle className="text-3xl">{data.total}</CardTitle>
      </CardHeader>
    </Card>
  );
}
