import Vue from "vue";

/* Dialogs */
import Dialog from "@/components/Dialogs/Dialog.vue";
import ErrorDialog from "@/components/Dialogs/ErrorDialog.vue";
import FiberDialog from "@/components/Dialogs/FiberDialog.vue";
import FilesDialog from "@/components/Dialogs/FilesDialog.vue";
import FormDialog from "@/components/Dialogs/FormDialog.vue";
import LanguageDialog from "@/components/Dialogs/LanguageDialog.vue";
import PagesDialog from "@/components/Dialogs/PagesDialog.vue";
import RemoveDialog from "@/components/Dialogs/RemoveDialog.vue";
import TextDialog from "@/components/Dialogs/TextDialog.vue";
import UsersDialog from "@/components/Dialogs/UsersDialog.vue";

Vue.component("k-dialog", Dialog);
Vue.component("k-error-dialog", ErrorDialog);
Vue.component("k-fiber-dialog", FiberDialog);
Vue.component("k-files-dialog", FilesDialog);
Vue.component("k-form-dialog", FormDialog);
Vue.component("k-language-dialog", LanguageDialog);
Vue.component("k-pages-dialog", PagesDialog);
Vue.component("k-remove-dialog", RemoveDialog);
Vue.component("k-text-dialog", TextDialog);
Vue.component("k-users-dialog", UsersDialog);

/* Drawers */
import Drawer from "@/components/Drawers/Drawer.vue";
import FormDrawer from "@/components/Drawers/FormDrawer.vue";

Vue.component("k-drawer", Drawer);
Vue.component("k-form-drawer", FormDrawer);

/* Form */
import Autocomplete from "@/components/Forms/Autocomplete.vue";
import Calendar from "@/components/Forms/Calendar.vue";
import Counter from "@/components/Forms/Counter.vue";
import Form from "@/components/Forms/Form.vue";
import FormButtons from "@/components/Forms/FormButtons.vue";
import FormIndicator from "@/components/Forms/FormIndicator.vue";
import Field from "@/components/Forms/Field.vue";
import Fieldset from "@/components/Forms/Fieldset.vue";
import Input from "@/components/Forms/Input.vue";
import Login from "@/components/Forms/Login.vue";
import LoginCode from "@/components/Forms/LoginCode.vue";
import Times from "@/components/Forms/Times.vue";
import Upload from "@/components/Forms/Upload.vue";
import Writer from "@/components/Forms/Writer/Writer.vue";

/** Form Helpers */
import LoginAlert from "@/components/Forms/LoginAlert.vue";

/* Form Structure */
import StructureForm from "@/components/Forms/Structure/StructureForm.vue";

/* Form Toolbar */
import Toolbar from "@/components/Forms/Toolbar.vue";
import ToolbarEmailDialog from "@/components/Forms/Toolbar/EmailDialog.vue";
import ToolbarLinkDialog from "@/components/Forms/Toolbar/LinkDialog.vue";

Vue.component("k-calendar", Calendar);
Vue.component("k-counter", Counter);
Vue.component("k-autocomplete", Autocomplete);
Vue.component("k-form", Form);
Vue.component("k-form-buttons", FormButtons);
Vue.component("k-form-indicator", FormIndicator);
Vue.component("k-field", Field);
Vue.component("k-fieldset", Fieldset);
Vue.component("k-input", Input);
Vue.component("k-login", Login);
Vue.component("k-login-code", LoginCode);
Vue.component("k-times", Times);
Vue.component("k-upload", Upload);
Vue.component("k-writer", Writer);

Vue.component("k-login-alert", LoginAlert);

/* Form Inputs */
import "@/components/Forms/Input/index.js";

/* Form Fields */
import "@/components/Forms/Field/index.js";

Vue.component("k-structure-form", StructureForm);

Vue.component("k-toolbar", Toolbar);
Vue.component("k-toolbar-email-dialog", ToolbarEmailDialog);
Vue.component("k-toolbar-link-dialog", ToolbarLinkDialog);

/* Layout */
import AspectRatio from "@/components/Layout/AspectRatio.vue";
import Bar from "@/components/Layout/Bar.vue";
import Box from "@/components/Layout/Box.vue";
import Bubble from "@/components/Layout/Bubble.vue";
import Bubbles from "@/components/Layout/Bubbles.vue";
import Collection from "@/components/Layout/Collection.vue";
import Column from "@/components/Layout/Column.vue";
import Dropzone from "@/components/Layout/Dropzone.vue";
import Empty from "@/components/Layout/Empty.vue";
import FilePreview from "@/components/Layout/FilePreview.vue";
import Grid from "@/components/Layout/Grid.vue";
import Header from "@/components/Layout/Header.vue";
import Inside from "@/components/Layout/Inside.vue";
import Item from "@/components/Layout/Item.vue";
import ItemImage from "@/components/Layout/ItemImage.vue";
import Items from "@/components/Layout/Items.vue";
import Overlay from "@/components/Layout/Overlay.vue";
import Panel from "@/components/Layout/Panel.vue";
import Stats from "@/components/Layout/Stats.vue";
import Table from "@/components/Layout/Table.vue";
import TableCell from "@/components/Layout/TableCell.vue";
import Tabs from "@/components/Layout/Tabs.vue";
import View from "@/components/Layout/View.vue";

Vue.component("k-aspect-ratio", AspectRatio);
Vue.component("k-bar", Bar);
Vue.component("k-box", Box);
Vue.component("k-bubble", Bubble);
Vue.component("k-bubbles", Bubbles);
Vue.component("k-collection", Collection);
Vue.component("k-column", Column);
Vue.component("k-dropzone", Dropzone);
Vue.component("k-empty", Empty);
Vue.component("k-file-preview", FilePreview);
Vue.component("k-grid", Grid);
Vue.component("k-header", Header);
Vue.component("k-inside", Inside);
Vue.component("k-item", Item);
Vue.component("k-item-image", ItemImage);
Vue.component("k-items", Items);
Vue.component("k-overlay", Overlay);
Vue.component("k-panel", Panel);
Vue.component("k-stats", Stats);
Vue.component("k-table", Table);
Vue.component("k-table-cell", TableCell);
Vue.component("k-tabs", Tabs);
Vue.component("k-view", View);

/* Misc */
import Draggable from "@/components/Misc/Draggable.vue";
import ErrorBoundary from "@/components/Misc/ErrorBoundary.vue";
import Fatal from "@/components/Misc/Fatal.vue";
import Headline from "@/components/Misc/Headline.vue";
import Icon from "@/components/Misc/Icon.vue";
import Icons from "@/components/Misc/Icons.vue";
import Image from "@/components/Misc/Image.vue";
import Loader from "@/components/Misc/Loader.vue";
import OfflineWarning from "@/components/Misc/OfflineWarning.vue";
import Progress from "@/components/Misc/Progress.vue";
import Registration from "@/components/Misc/Registration.vue";
import SortHandle from "@/components/Misc/SortHandle.vue";
import StatusIcon from "@/components/Misc/StatusIcon.vue";
import Text from "@/components/Misc/Text.vue";
import UserInfo from "@/components/Misc/UserInfo.vue";

Vue.component("k-draggable", Draggable);
Vue.component("k-error-boundary", ErrorBoundary);
Vue.component("k-fatal", Fatal);
Vue.component("k-headline", Headline);
Vue.component("k-icon", Icon);
Vue.component("k-icons", Icons);
Vue.component("k-image", Image);
Vue.component("k-loader", Loader);
Vue.component("k-offline-warning", OfflineWarning);
Vue.component("k-progress", Progress);
Vue.component("k-registration", Registration);
Vue.component("k-status-icon", StatusIcon);
Vue.component("k-sort-handle", SortHandle);
Vue.component("k-text", Text);
Vue.component("k-user-info", UserInfo);

/* Navigation */
import "@/components/Navigation/index.js";

/* Sections */
import "@/components/Sections/index.js";

/* Views */
import "@/components/Views/index.js";

/* Blocks */
import "@/components/Forms/Blocks/index.js";

/* Field Previews */
import "@/components/Forms/Previews/index.js";

/* Architect */
import "@/components/Architect/index.js";
