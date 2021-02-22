import React, { useState } from "react";
import { trackEvent } from "../analytics";
import { load, questionCircle, save, saveAs } from "../components/icons";
import { ProjectName } from "../components/ProjectName";
import { ToolButton } from "../components/ToolButton";
import "../components/ToolIcon.scss";
import { Tooltip } from "../components/Tooltip";
import { loadFromJSON, saveAsJSON } from "../data";
import { serializeAsJSON } from "../data/json";
import { getNonDeletedElements } from "../element";
import { t } from "../i18n";
import useIsMobile from "../is-mobile";
import { KEYS } from "../keys";
import { getSelectedElements } from "../scene";
import { nFormatter } from "../utils";
import { register } from "./register";

export const actionChangeProjectName = register({
  name: "changeProjectName",
  perform: (_elements, appState, value) => {
    trackEvent("change", "title");
    return { appState: { ...appState, name: value }, commitToHistory: false };
  },
  PanelComponent: ({ appState, updateData }) => (
    <ProjectName
      label={t("labels.fileTitle")}
      value={appState.name || "Unnamed"}
      onChange={(name: string) => updateData(name)}
    />
  ),
});

export const actionChangeExportBackground = register({
  name: "changeExportBackground",
  perform: (_elements, appState, value) => {
    return {
      appState: { ...appState, exportBackground: value },
      commitToHistory: false,
    };
  },
  PanelComponent: ({ appState, updateData }) => (
    <label>
      <input
        type="checkbox"
        checked={appState.exportBackground}
        onChange={(event) => updateData(event.target.checked)}
      />{" "}
      {t("labels.withBackground")}
    </label>
  ),
});

export const actionChangeExportSelected = register({
  name: "changeExportSelected",
  perform: (_elements, appState, value) => {
    return {
      appState: { ...appState, exportSelected: value },
      commitToHistory: false,
    };
  },
  PanelComponent: ({ appState, updateData }) => (
    <label>
      <input
        type="checkbox"
        checked={appState.exportSelected}
        onChange={(event) => updateData(event.target.checked)}
      />{" "}
      {t("labels.onlySelected")}
    </label>
  ),
});

export const actionChangeExportEmbedScene = register({
  name: "changeExportEmbedScene",
  perform: (_elements, appState, value) => {
    return {
      appState: { ...appState, exportEmbedScene: value },
      commitToHistory: false,
    };
  },
  PanelComponent: ({ elements, appState, updateData }) => {
    const [increasedPngSize, setPngIncreasedSize] = useState(0);
    const [increasedSvgSize, setSvgIncreasedSize] = useState(0);
    if (appState.exportEmbedScene) {
      import(/* webpackChunkName: "image" */ "../data/image").then(
        async (_) => {
          const nonDeletedElements = getNonDeletedElements(elements);
          const selectedElements = getSelectedElements(
            nonDeletedElements,
            appState,
          );
          const incPng = await _.getPngMetatdataSize({
            metadata: serializeAsJSON(
              appState.exportSelected ? selectedElements : elements,
              appState,
            ),
          });
          setPngIncreasedSize(incPng);
          const incSvg = await _.getSvgMetatdataSize({
            text: serializeAsJSON(
              appState.exportSelected ? selectedElements : elements,
              appState,
            ),
          });
          setSvgIncreasedSize(incSvg);
        },
      );
    }

    return (
      <label style={{ display: "flex" }}>
        <input
          type="checkbox"
          checked={appState.exportEmbedScene}
          onChange={(event) => updateData(event.target.checked)}
        />{" "}
        {t("labels.exportEmbedScene")}
        {appState.exportEmbedScene && (
          <Tooltip
            label={`PNG: +${nFormatter(
              increasedPngSize,
              1,
            )}, SVG: +${nFormatter(increasedSvgSize, 1)}`}
            position="above"
          >
            {
              <div style={{ color: "gray", paddingLeft: 3 }}>
                {`(${t("labels.average")}: +${nFormatter(
                  (increasedPngSize + increasedSvgSize) / 2,
                  1,
                )})`}
              </div>
            }
          </Tooltip>
        )}
        <Tooltip
          label={t("labels.exportEmbedScene_details")}
          position="above"
          long={true}
        >
          <div className="TooltipIcon">{questionCircle}</div>
        </Tooltip>
      </label>
    );
  },
});

export const actionChangeShouldAddWatermark = register({
  name: "changeShouldAddWatermark",
  perform: (_elements, appState, value) => {
    return {
      appState: { ...appState, shouldAddWatermark: value },
      commitToHistory: false,
    };
  },
  PanelComponent: ({ appState, updateData }) => (
    <label>
      <input
        type="checkbox"
        checked={appState.shouldAddWatermark}
        onChange={(event) => updateData(event.target.checked)}
      />{" "}
      {t("labels.addWatermark")}
    </label>
  ),
});

export const actionSaveScene = register({
  name: "saveScene",
  perform: async (elements, appState, value) => {
    const fileHandleExists = !!appState.fileHandle;
    try {
      const { fileHandle } = await saveAsJSON(elements, appState);
      return {
        commitToHistory: false,
        appState: {
          ...appState,
          fileHandle,
          toastMessage: fileHandleExists
            ? fileHandle.name
              ? t("toast.fileSavedToFilename").replace(
                  "{filename}",
                  `"${fileHandle.name}"`,
                )
              : t("toast.fileSaved")
            : null,
        },
      };
    } catch (error) {
      if (error?.name !== "AbortError") {
        console.error(error);
      }
      return { commitToHistory: false };
    }
  },
  keyTest: (event) =>
    event.key === KEYS.S && event[KEYS.CTRL_OR_CMD] && !event.shiftKey,
  PanelComponent: ({ updateData }) => (
    <ToolButton
      type="button"
      icon={save}
      title={t("buttons.save")}
      aria-label={t("buttons.save")}
      showAriaLabel={useIsMobile()}
      onClick={() => updateData(null)}
    />
  ),
});

export const actionSaveAsScene = register({
  name: "saveAsScene",
  perform: async (elements, appState, value) => {
    try {
      const { fileHandle } = await saveAsJSON(elements, {
        ...appState,
        fileHandle: null,
      });
      return { commitToHistory: false, appState: { ...appState, fileHandle } };
    } catch (error) {
      if (error?.name !== "AbortError") {
        console.error(error);
      }
      return { commitToHistory: false };
    }
  },
  keyTest: (event) =>
    event.key === KEYS.S && event.shiftKey && event[KEYS.CTRL_OR_CMD],
  PanelComponent: ({ updateData }) => (
    <ToolButton
      type="button"
      icon={saveAs}
      title={t("buttons.saveAs")}
      aria-label={t("buttons.saveAs")}
      showAriaLabel={useIsMobile()}
      hidden={
        !("chooseFileSystemEntries" in window || "showOpenFilePicker" in window)
      }
      onClick={() => updateData(null)}
    />
  ),
});

export const actionLoadScene = register({
  name: "loadScene",
  perform: async (elements, appState) => {
    try {
      const {
        elements: loadedElements,
        appState: loadedAppState,
      } = await loadFromJSON(appState);
      return {
        elements: loadedElements,
        appState: loadedAppState,
        commitToHistory: true,
      };
    } catch (error) {
      if (error?.name === "AbortError") {
        return false;
      }
      return {
        elements,
        appState: { ...appState, errorMessage: error.message },
        commitToHistory: false,
      };
    }
  },
  keyTest: (event) => event[KEYS.CTRL_OR_CMD] && event.key === KEYS.O,
  PanelComponent: ({ updateData, appState }) => (
    <ToolButton
      type="button"
      icon={load}
      title={t("buttons.load")}
      aria-label={t("buttons.load")}
      showAriaLabel={useIsMobile()}
      onClick={updateData}
    />
  ),
});
