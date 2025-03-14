import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/modules/ui/components/tooltip";
import { TimerIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { getQuestionIcon } from "@formbricks/lib/utils/questions";
import { recallToHeadline } from "@formbricks/lib/utils/recall";
import { TSurvey, TSurveyQuestionType, TSurveySummary } from "@formbricks/types/surveys/types";

interface SummaryDropOffsProps {
  dropOff: TSurveySummary["dropOff"];
  survey: TSurvey;
}

export const SummaryDropOffs = ({ dropOff, survey }: SummaryDropOffsProps) => {
  const t = useTranslations();
  const getIcon = (questionType: TSurveyQuestionType) => {
    const Icon = getQuestionIcon(questionType);
    return <Icon className="mt-[3px] h-5 w-5 shrink-0 text-slate-600" />;
  };

  const formatTextWithSlashes = (text: string): (string | JSX.Element)[] => {
    const regex = /\/(.*?)\\/g;
    const parts = text.split(regex);

    return parts.map((part, index) => {
      // Check if the part was inside slashes
      if (index % 2 !== 0) {
        return (
          <span key={index} className="mx-1 rounded-md bg-slate-100 p-1 px-2 text-lg">
            @{part}
          </span>
        );
      } else {
        return part;
      }
    });
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="">
        <div className="grid h-10 grid-cols-6 items-center border-y border-slate-200 bg-slate-100 text-sm font-semibold text-slate-600">
          <div className="col-span-3 pl-4 md:pl-6">{t("common.questions")}</div>
          <div className="flex justify-center">
            <TooltipProvider delayDuration={50}>
              <Tooltip>
                <TooltipTrigger>
                  <TimerIcon className="h-5 w-5" />
                </TooltipTrigger>
                <TooltipContent side={"top"}>
                  <p className="text-center font-normal">{t("environments.surveys.summary.ttc_tooltip")}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="px-4 text-center md:px-6">{t("environments.surveys.summary.impressions")}</div>
          <div className="pr-6 text-center md:pl-6">{t("environments.surveys.summary.drop_offs")}</div>
        </div>
        {dropOff.map((quesDropOff) => (
          <div
            key={quesDropOff.questionId}
            className="grid grid-cols-6 items-center border-b border-slate-100 py-2 text-sm text-slate-800 md:text-base">
            <div className="col-span-3 flex gap-3 pl-4 md:pl-6">
              {getIcon(quesDropOff.questionType)}
              <p>
                {formatTextWithSlashes(
                  recallToHeadline(
                    {
                      ["default"]: quesDropOff.headline,
                    },
                    survey,
                    true,
                    "default"
                  )["default"]
                )}
              </p>
            </div>
            <div className="whitespace-pre-wrap text-center font-semibold">
              {quesDropOff.ttc > 0 ? (quesDropOff.ttc / 1000).toFixed(2) + "s" : "N/A"}
            </div>
            <div className="whitespace-pre-wrap text-center font-semibold">{quesDropOff.impressions}</div>
            <div className="pl-6 text-center md:px-6">
              <span className="mr-1.5 font-semibold">{quesDropOff.dropOffCount}</span>
              <span>({Math.round(quesDropOff.dropOffPercentage)}%)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
