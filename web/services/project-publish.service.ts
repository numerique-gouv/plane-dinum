import { API_BASE_URL } from "helpers/common.helper";
// services
import APIService from "services/api.service";
import trackEventServices from "services/track-event.service";
// types
import { ICurrentUserResponse } from "types";
import { IProjectPublishSettings } from "store/project-publish";

class ProjectServices extends APIService {
  constructor() {
    super(API_BASE_URL);
  }

  async getProjectSettingsAsync(
    workspace_slug: string,
    project_slug: string,
    user: ICurrentUserResponse | undefined
  ): Promise<any> {
    return this.get(
      `/api/workspaces/${workspace_slug}/projects/${project_slug}/project-deploy-boards/`
    )
      .then((response) => {
        // trackEventServices.trackProjectPublishSettingsEvent(
        //   response.data,
        //   "GET_PROJECT_PUBLISH_SETTINGS",
        //   user
        // );
        return response?.data;
      })
      .catch((error) => {
        throw error?.response;
      });
  }

  async createProjectSettingsAsync(
    workspace_slug: string,
    project_slug: string,
    data: IProjectPublishSettings,
    user: ICurrentUserResponse | undefined
  ): Promise<any> {
    return this.post(
      `/api/workspaces/${workspace_slug}/projects/${project_slug}/project-deploy-boards/`,
      data
    )
      .then((response) => {
        //   trackEventServices.trackProjectPublishSettingsEvent(
        //     response.data,
        //     "CREATE_PROJECT_PUBLISH_SETTINGS",
        //     user
        //   );

        return response?.data;
      })
      .catch((error) => {
        throw error?.response;
      });
  }

  async updateProjectSettingsAsync(
    workspace_slug: string,
    project_slug: string,
    project_publish_id: string,
    data: IProjectPublishSettings,
    user: ICurrentUserResponse | undefined
  ): Promise<any> {
    return this.patch(
      `/api/workspaces/${workspace_slug}/projects/${project_slug}/project-deploy-boards/${project_publish_id}/`,
      data
    )
      .then((response) => {
        //   trackEventServices.trackProjectPublishSettingsEvent(
        //     response.data,
        //     "UPDATE_PROJECT_PUBLISH_SETTINGS",
        //     user
        //   );
        return response?.data;
      })
      .catch((error) => {
        throw error?.response;
      });
  }

  async deleteProjectSettingsAsync(
    workspace_slug: string,
    project_slug: string,
    project_publish_id: string,
    user: ICurrentUserResponse | undefined
  ): Promise<any> {
    return this.delete(
      `/api/workspaces/${workspace_slug}/projects/${project_slug}/project-deploy-boards/${project_publish_id}/`
    )
      .then((response) => {
        //   trackEventServices.trackProjectPublishSettingsEvent(
        //     response.data,
        //     "DELETE_PROJECT_PUBLISH_SETTINGS",
        //     user
        //   );
        return response?.data;
      })
      .catch((error) => {
        throw error?.response;
      });
  }
}

export default ProjectServices;
