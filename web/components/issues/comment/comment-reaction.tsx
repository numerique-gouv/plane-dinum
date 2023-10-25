import React from "react";

import { useRouter } from "next/router";

// hooks
import useUser from "hooks/use-user";
import useCommentReaction from "hooks/use-comment-reaction";
// ui
import { ReactionSelector } from "components/core";
// helper
import { renderEmoji } from "helpers/emoji.helper";

type Props = {
  projectId?: string | string[];
  commentId: string;
};

export const CommentReaction: React.FC<Props> = (props) => {
  const { projectId, commentId } = props;

  const router = useRouter();
  const { workspaceSlug } = router.query;

  const { user } = useUser();

  const {
    commentReactions,
    groupedReactions,
    handleReactionCreate,
    handleReactionDelete,
    isLoading,
  } = useCommentReaction(workspaceSlug, projectId, commentId);

  const handleReactionClick = (reaction: string) => {
    if (!workspaceSlug || !projectId || !commentId) return;

    const isSelected = commentReactions?.some(
      (r) => r.actor === user?.id && r.reaction === reaction
    );

    if (isSelected) {
      handleReactionDelete(reaction);
    } else {
      handleReactionCreate(reaction);
    }
  };

  return (
    <div className="flex gap-1.5 items-center mt-2">
      <ReactionSelector
        size="md"
        position="top"
        value={
          commentReactions
            ?.filter((reaction) => reaction.actor === user?.id)
            .map((r) => r.reaction) || []
        }
        onSelect={handleReactionClick}
      />

      {Object.keys(groupedReactions || {}).map(
        (reaction) =>
          groupedReactions?.[reaction]?.length &&
          groupedReactions[reaction].length > 0 && (
            <button
              type="button"
              onClick={() => {
                handleReactionClick(reaction);
              }}
              key={reaction}
              className={`flex items-center gap-1 text-custom-text-100 text-sm h-full px-2 py-1 rounded-md ${
                commentReactions?.some((r) => r.actor === user?.id && r.reaction === reaction)
                  ? "bg-custom-primary-100/10"
                  : "bg-custom-background-80"
              }`}
            >
              <span>{renderEmoji(reaction)}</span>
              <span
                className={
                  commentReactions?.some((r) => r.actor === user?.id && r.reaction === reaction)
                    ? "text-custom-primary-100"
                    : ""
                }
              >
                {groupedReactions?.[reaction].length}{" "}
              </span>
            </button>
          )
      )}
    </div>
  );
};
