import React, { useRef, useState } from "react";

import useSWR from "swr";

import { useRouter } from "next/router";

// services
import issuesService from "services/issues.service";
// hooks
import useDynamicDropdownPosition from "hooks/use-dynamic-dropdown";
// headless ui
import { Combobox } from "@headlessui/react";
// component
import { CreateLabelModal } from "components/labels";
// icons
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { CheckIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { PlusIcon } from "lucide-react";
// types
import { Tooltip } from "components/ui";
import { ICurrentUserResponse, IIssueLabels } from "types";
// constants
import { PROJECT_ISSUE_LABELS } from "constants/fetch-keys";

type Props = {
  value: string[];
  projectId: string;
  onChange: (data: any) => void;
  labelsDetails: any[];
  className?: string;
  buttonClassName?: string;
  optionsClassName?: string;
  maxRender?: number;
  hideDropdownArrow?: boolean;
  disabled?: boolean;
  user: ICurrentUserResponse | undefined;
};

export const LabelSelect: React.FC<Props> = ({
  value,
  projectId,
  onChange,
  labelsDetails,
  className = "",
  buttonClassName = "",
  optionsClassName = "",
  maxRender = 2,
  hideDropdownArrow = false,
  disabled = false,
  user,
}) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [fetchStates, setFetchStates] = useState(false);

  const [labelModal, setLabelModal] = useState(false);

  const router = useRouter();
  const { workspaceSlug } = router.query;

  const dropdownBtn = useRef<any>(null);
  const dropdownOptions = useRef<any>(null);

  const { data: issueLabels } = useSWR<IIssueLabels[]>(
    projectId && fetchStates ? PROJECT_ISSUE_LABELS(projectId) : null,
    workspaceSlug && projectId && fetchStates
      ? () => issuesService.getIssueLabels(workspaceSlug as string, projectId)
      : null
  );

  const options = issueLabels?.map((label) => ({
    value: label.id,
    query: label.name,
    content: (
      <div className="flex items-center justify-start gap-2">
        <span
          className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
          style={{
            backgroundColor: label.color,
          }}
        />
        <span>{label.name}</span>
      </div>
    ),
  }));

  const filteredOptions =
    query === ""
      ? options
      : options?.filter((option) => option.query.toLowerCase().includes(query.toLowerCase()));

  const label = (
    <div className={`flex  items-center gap-2 text-custom-text-200`}>
      {labelsDetails.length > 0 ? (
        labelsDetails.length <= maxRender ? (
          <>
            {labelsDetails.map((label) => (
              <div
                key={label.id}
                className="flex cursor-default items-center flex-shrink-0 rounded-md border border-custom-border-300 px-2.5 py-1 text-xs shadow-sm"
              >
                <div className="flex items-center gap-1.5 text-custom-text-200">
                  <span
                    className="h-2 w-2 flex-shrink-0 rounded-full"
                    style={{
                      backgroundColor: label?.color ?? "#000000",
                    }}
                  />
                  {label.name}
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className="flex cursor-default items-center flex-shrink-0 rounded-md border border-custom-border-300 px-2.5 py-1 text-xs shadow-sm">
            <Tooltip
              position="top"
              tooltipHeading="Labels"
              tooltipContent={labelsDetails.map((l) => l.name).join(", ")}
            >
              <div className="flex items-center gap-1.5 text-custom-text-200">
                <span className="h-2 w-2 flex-shrink-0 rounded-full bg-custom-primary" />
                {`${value.length} Labels`}
              </div>
            </Tooltip>
          </div>
        )
      ) : (
        ""
      )}
    </div>
  );

  useDynamicDropdownPosition(isOpen, () => setIsOpen(false), dropdownBtn, dropdownOptions);

  const footerOption = (
    <button
      type="button"
      className="flex w-full select-none items-center rounded py-2 px-1 hover:bg-custom-background-80"
      onClick={() => setLabelModal(true)}
    >
      <span className="flex items-center justify-start gap-1 text-custom-text-200">
        <PlusIcon className="h-4 w-4" aria-hidden="true" />
        <span>Create New Label</span>
      </span>
    </button>
  );

  return (
    <>
      {projectId && (
        <CreateLabelModal
          isOpen={labelModal}
          handleClose={() => setLabelModal(false)}
          projectId={projectId}
          user={user}
        />
      )}
      <Combobox
        as="div"
        className={`flex-shrink-0 text-left ${className}`}
        value={value}
        onChange={onChange}
        disabled={disabled}
        multiple
      >
        {({ open }: { open: boolean }) => {
          if (open) {
            if (!isOpen) setIsOpen(true);
            setFetchStates(true);
          } else if (isOpen) setIsOpen(false);

          return (
            <>
              <Combobox.Button
                ref={dropdownBtn}
                type="button"
                className={`flex items-center justify-between gap-1 w-full text-xs ${
                  disabled
                    ? "cursor-not-allowed text-custom-text-200"
                    : value.length <= maxRender
                    ? "cursor-pointer"
                    : "cursor-pointer hover:bg-custom-background-80"
                }  ${buttonClassName}`}
              >
                {label}
                {!hideDropdownArrow && !disabled && (
                  <ChevronDownIcon className="h-3 w-3" aria-hidden="true" />
                )}
              </Combobox.Button>
              <div className={`${open ? "fixed z-20 top-0 left-0 h-full w-full cursor-auto" : ""}`}>
                <Combobox.Options
                  ref={dropdownOptions}
                  className={`absolute z-10 border border-custom-border-300 px-2 py-2.5 rounded bg-custom-background-100 text-xs shadow-lg focus:outline-none w-48 whitespace-nowrap mt-1 ${optionsClassName}`}
                >
                  <div className="flex w-full items-center justify-start rounded border border-custom-border-200 bg-custom-background-90 px-2">
                    <MagnifyingGlassIcon className="h-3.5 w-3.5 text-custom-text-300" />
                    <Combobox.Input
                      className="w-full bg-transparent py-1 px-2 text-xs text-custom-text-200 placeholder:text-custom-text-400 focus:outline-none"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search"
                      displayValue={(assigned: any) => assigned?.name}
                    />
                  </div>
                  <div className={`mt-2 space-y-1 max-h-48 overflow-y-scroll`}>
                    {filteredOptions ? (
                      filteredOptions.length > 0 ? (
                        filteredOptions.map((option) => (
                          <Combobox.Option
                            key={option.value}
                            value={option.value}
                            className={({ active, selected }) =>
                              `flex items-center justify-between gap-2 cursor-pointer select-none truncate rounded px-1 py-1.5 ${
                                active && !selected ? "bg-custom-background-80" : ""
                              } ${selected ? "text-custom-text-100" : "text-custom-text-200"}`
                            }
                          >
                            {({ selected }) => (
                              <>
                                {option.content}
                                {selected && <CheckIcon className={`h-3.5 w-3.5`} />}
                              </>
                            )}
                          </Combobox.Option>
                        ))
                      ) : (
                        <span className="flex items-center gap-2 p-1">
                          <p className="text-left text-custom-text-200 ">No matching results</p>
                        </span>
                      )
                    ) : (
                      <p className="text-center text-custom-text-200">Loading...</p>
                    )}
                  </div>
                  {footerOption}
                </Combobox.Options>
              </div>
            </>
          );
        }}
      </Combobox>
    </>
  );
};
