import { IBlogsState, BlogActionTypes, SAVE_BLOGS_AND_FILTERS, UPDATE_BLOGS_AND_FILTERS } from "./types";
import { isBooleanFilter, isRangeFilter, isValueFilter } from "../../../../interfaces/Filter";
import { isBlogPasses } from "../../../../utils/filters";

import { TrackerService } from "../../../../services/tracker";
import { TrackerSources, TrackerActions, TrackerPositions } from "../../../../../shared/interfaces";

export const initialState: IBlogsState = {
  defaultBlogs: [],
  blogs: [],
  defaultFilters: [],
  filters: [],
};

export const blogsReducer = (state: IBlogsState, action: BlogActionTypes): IBlogsState => {
  switch (action.type) {
    case SAVE_BLOGS_AND_FILTERS:
      TrackerService.setTimeStamps({
        source: TrackerSources.CONTEXT_V1,
        position: TrackerPositions.CONTEXT_DISPATCH_REDUCER,
        action: TrackerActions.FETCH_BLOG_LIST,
        state: "finished",
        time: Date.now(),
      });

      TrackerService.setTimeStamps({
        source: TrackerSources.CONTEXT_V1,
        position: TrackerPositions.CONTEXT_COMMIT,
        action: TrackerActions.FETCH_BLOG_LIST,
        state: "started",
        time: Date.now(),
        affectedItems: action.payload.blogs.length,
      });

      return {
        ...state,
        blogs: action.payload.blogs,
        defaultBlogs: action.payload.blogs,
        filters: action.payload.filters,
        defaultFilters: action.payload.filters,
      };
    case UPDATE_BLOGS_AND_FILTERS: {
      TrackerService.setTimeStamps({
        source: TrackerSources.CONTEXT_V1,
        position: TrackerPositions.CONTEXT_DISPATCH_REDUCER,
        action: TrackerActions.CHECKBOX_FILTER,
        state: "finished",
        time: Date.now(),
      });

      const { title, value, secondValue } = action.payload;

      const filters = state.filters.map((filter) => {
        if (filter.title !== title) return filter;
        const updated = JSON.parse(JSON.stringify(filter));

        if (isBooleanFilter(updated)) {
          updated.value = !updated.value;
        } else if (isValueFilter(updated)) {
          updated.value = Number(value);
        } else if (isRangeFilter(updated)) {
          updated.min = Number(value);
          updated.max = Number(secondValue);
        }

        return updated;
      });

      const blogs = state.defaultBlogs.map(
        (blog) => (isBlogPasses(blog, filters) ? blog : null),
      ).filter(Boolean);

      TrackerService.setTimeStamps({
        source: TrackerSources.CONTEXT_V1,
        position: TrackerPositions.CONTEXT_COMMIT,
        action: TrackerActions.CHECKBOX_FILTER,
        state: "started",
        time: Date.now(),
        affectedItems: blogs.length,
      });

      return {
        ...state,
        blogs,
        filters,
      };
    }
    default:
      return state;
  }
};
