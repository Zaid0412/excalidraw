import React from "react";
import { AppState } from "../types";
import { ActionManager } from "../actions/manager";
import { t } from "../i18n";
import Stack from "./Stack";
import { showSelectedShapeActions } from "../element";
import { NonDeletedExcalidrawElement } from "../element/types";
import { FixedSideContainer } from "./FixedSideContainer";
import { Island } from "./Island";
import { HintViewer } from "./HintViewer";
import { calculateScrollCenter, getSelectedElements } from "../scene";
import { SelectedShapeActions, ShapesSwitcher } from "./Actions";
import { Section } from "./Section";
import CollabButton from "./CollabButton";
import { SCROLLBAR_WIDTH, SCROLLBAR_MARGIN } from "../scene/scrollbars";
import { LockButton } from "./LockButton";
import { UserList } from "./UserList";
import { BackgroundPickerAndDarkModeToggle } from "./BackgroundPickerAndDarkModeToggle";
import { LibraryButton } from "./LibraryButton";
import { PenModeButton } from "./PenModeButton";

type MobileMenuProps = {
  appState: AppState;
  actionManager: ActionManager;
  renderJSONExportDialog: () => React.ReactNode;
  renderImageExportDialog: () => React.ReactNode;
  setAppState: React.Component<any, AppState>["setState"];
  elements: readonly NonDeletedExcalidrawElement[];
  libraryMenu: JSX.Element | null;
  onCollabButtonClick?: () => void;
  onLockToggle: () => void;
  onPenModeToggle: () => void;
  canvas: HTMLCanvasElement | null;
  allowedShapes: Array<String>;
  disableAlignItems?: boolean;
  disableGrouping?: boolean;
  disableHints?: boolean;
  disableLink?: boolean;
  disableShortcuts?: boolean;
  disableVerticalAlignOptions?: boolean;
  fontSizeOptions?: Array<String>;
  isCollaborating: boolean;
  hideArrowHeadsOptions?: boolean;
  hideClearCanvas?: boolean;
  hideColorInput?: boolean;
  hideFontFamily?: boolean;
  hideIOActions?: boolean;
  hideLayers?: boolean;
  hideLibraries?: boolean;
  hideLockButton?: boolean;
  hideOpacityInput?: boolean;
  hideSharpness?: boolean;
  hideStrokeStyle?: boolean;
  hideTextAlign?: boolean;
  hideThemeControls?: boolean;
  hideUserList?: boolean;
  renderCustomFooter?: (
    isMobile: boolean,
    appState: AppState,
  ) => JSX.Element | null;
  showThemeBtn: boolean;
  onImageAction: (data: { insertOnCanvasDirectly: boolean }) => void;
  renderTopRightUI?: (
    isMobile: boolean,
    appState: AppState,
  ) => JSX.Element | null;
  renderStats: () => JSX.Element | null;
};

export const MobileMenu = ({
  appState,
  elements,
  libraryMenu,
  actionManager,
  renderJSONExportDialog,
  renderImageExportDialog,
  setAppState,
  onCollabButtonClick,
  onLockToggle,
  onPenModeToggle,
  canvas,
  allowedShapes,
  disableAlignItems,
  disableGrouping,
  disableHints,
  disableLink,
  disableShortcuts,
  disableVerticalAlignOptions,
  hideArrowHeadsOptions,
  fontSizeOptions,
  isCollaborating,
  hideClearCanvas,
  hideColorInput,
  hideFontFamily,
  hideIOActions,
  hideLayers,
  hideLibraries,
  hideLockButton,
  hideOpacityInput,
  hideSharpness,
  hideStrokeStyle,
  hideTextAlign,
  hideThemeControls,
  hideUserList,
  renderCustomFooter,
  showThemeBtn,
  onImageAction,
  renderTopRightUI,
  renderStats,
}: MobileMenuProps) => {
  const renderToolbar = () => {
    return (
      <FixedSideContainer side="top" className="App-top-bar">
        <Section heading="shapes">
          {(heading: React.ReactNode) => (
            <Stack.Col gap={4} align="center">
              <Stack.Row gap={1} className="App-toolbar-container">
                <Island padding={1} className="App-toolbar">
                  {heading}
                  <Stack.Row gap={1}>
                    <ShapesSwitcher
                      appState={appState}
                      canvas={canvas}
                      activeTool={appState.activeTool}
                      allowedShapes={allowedShapes}
                      disableShortcuts={disableShortcuts}
                      setAppState={setAppState}
                      onImageAction={({ pointerType }) => {
                        onImageAction({
                          insertOnCanvasDirectly: pointerType !== "mouse",
                        });
                      }}
                    />
                  </Stack.Row>
                </Island>
                {renderTopRightUI && renderTopRightUI(true, appState)}
                {!hideLockButton && (
                  <LockButton
                    checked={appState.activeTool.locked}
                    onChange={onLockToggle}
                    title={t("toolBar.lock")}
                    isMobile
                  />
                )}
                {!hideLibraries && (
                  <LibraryButton
                    appState={appState}
                    setAppState={setAppState}
                    isMobile
                  />
                )}
                <PenModeButton
                  checked={appState.penMode}
                  onChange={onPenModeToggle}
                  title={t("toolBar.penMode")}
                  isMobile
                  penDetected={appState.penDetected}
                />
              </Stack.Row>
              {libraryMenu}
            </Stack.Col>
          )}
        </Section>
        {!disableHints && (
          <HintViewer appState={appState} elements={elements} isMobile={true} />
        )}
      </FixedSideContainer>
    );
  };

  const renderAppToolbar = () => {
    // Render eraser conditionally in mobile
    const showEraser =
      !appState.viewModeEnabled &&
      !appState.editingElement &&
      getSelectedElements(elements, appState).length === 0;

    if (appState.viewModeEnabled) {
      return null;
      // TODO: uncomment after fixing the mobile export
      // return (
      //   <div className="App-toolbar-content">
      //     {actionManager.renderAction("toggleCanvasMenu")}
      //   </div>
      // );
    }

    return (
      <div className="App-toolbar-content">
        {/* TODO: uncomment after fixing the mobile export */}
        {/* {actionManager.renderAction("toggleCanvasMenu")} */}
        {actionManager.renderAction("toggleEditMenu")}

        {actionManager.renderAction("undo")}
        {actionManager.renderAction("redo")}
        {showEraser &&
          actionManager.renderAction("eraser", { disableShortcuts })}

        {actionManager.renderAction(
          appState.multiElement ? "finalize" : "duplicateSelection",
        )}
        {actionManager.renderAction("deleteSelectedElements")}
      </div>
    );
  };

  const renderCanvasActions = () => {
    if (appState.viewModeEnabled) {
      return (
        <>
          {!hideIOActions && renderJSONExportDialog()}
          {renderImageExportDialog()}
        </>
      );
    }
    return (
      <>
        {!hideClearCanvas && actionManager.renderAction("clearCanvas")}
        {!hideIOActions && (
          <>
            {actionManager.renderAction("loadScene")}
            {renderJSONExportDialog()}
          </>
        )}
        {renderImageExportDialog()}
        {onCollabButtonClick && (
          <CollabButton
            isCollaborating={isCollaborating}
            collaboratorCount={appState.collaborators.size}
            onClick={onCollabButtonClick}
          />
        )}
        {!hideThemeControls && (
          <BackgroundPickerAndDarkModeToggle
            actionManager={actionManager}
            appState={appState}
            setAppState={setAppState}
            showThemeBtn={showThemeBtn}
            disableShortcuts={disableShortcuts}
          />
        )}
      </>
    );
  };
  return (
    <>
      {!appState.viewModeEnabled && renderToolbar()}
      {renderStats()}
      <div
        className="App-bottom-bar"
        style={{
          marginBottom: SCROLLBAR_WIDTH + SCROLLBAR_MARGIN * 2,
          marginLeft: SCROLLBAR_WIDTH + SCROLLBAR_MARGIN * 2,
          marginRight: SCROLLBAR_WIDTH + SCROLLBAR_MARGIN * 2,
        }}
      >
        <Island padding={0}>
          {appState.openMenu === "canvas" ? (
            <Section className="App-mobile-menu" heading="canvasActions">
              <div className="panelColumn">
                <Stack.Col gap={4}>
                  {renderCanvasActions()}
                  {renderCustomFooter?.(true, appState)}
                  {!hideUserList && appState.collaborators.size > 0 && (
                    <fieldset>
                      <legend>{t("labels.collaborators")}</legend>
                      <UserList
                        mobile
                        collaborators={appState.collaborators}
                        actionManager={actionManager}
                      />
                    </fieldset>
                  )}
                </Stack.Col>
              </div>
            </Section>
          ) : appState.openMenu === "shape" &&
            !appState.viewModeEnabled &&
            showSelectedShapeActions(appState, elements) ? (
            <Section className="App-mobile-menu" heading="selectedShapeActions">
              <SelectedShapeActions
                appState={appState}
                elements={elements}
                renderAction={actionManager.renderAction}
                activeTool={appState.activeTool.type}
                disableAlignItems={disableAlignItems}
                disableGrouping={disableGrouping}
                disableLink={disableLink}
                disableVerticalAlignOptions={disableVerticalAlignOptions}
                fontSizeOptions={fontSizeOptions}
                hideArrowHeadsOptions={hideArrowHeadsOptions}
                hideLayers={hideLayers}
                hideOpacityInput={hideOpacityInput}
                disableShortcuts={disableShortcuts}
                hideColorInput={hideColorInput}
                hideFontFamily={hideFontFamily}
                hideSharpness={hideSharpness}
                hideStrokeStyle={hideStrokeStyle}
                hideTextAlign={hideTextAlign}
              />
            </Section>
          ) : null}
          <footer className="App-toolbar">
            {renderAppToolbar()}
            {appState.scrolledOutside &&
              !appState.openMenu &&
              !appState.isLibraryOpen && (
                <button
                  className="scroll-back-to-content"
                  onClick={() => {
                    setAppState({
                      ...calculateScrollCenter(elements, appState, canvas),
                    });
                  }}
                >
                  {t("buttons.scrollBackToContent")}
                </button>
              )}
          </footer>
        </Island>
      </div>
    </>
  );
};
