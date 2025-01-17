/*
 * Vencord, a modification for Discord's desktop app
 * Copyright (c) 2023 Vendicated and contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import { Devs } from "@utils/constants";
import definePlugin from "@utils/types";
import { filters, findLazy, mapMangledModuleLazy } from "@webpack";

const ExpressionPickerState = mapMangledModuleLazy('name:"expression-picker-last-active-view"', {
    close: filters.byCode("activeView:null", "setState")
});
const ComponentDispatch = findLazy(m => m.emitter?._events?.INSERT_TEXT);

export default definePlugin({
    name: "GifPaste",
    description: "Makes picking a gif in the gif picker insert a link into the chatbox instead of instantly sending it",
    authors: [Devs.Ven],

    patches: [{
        find: ".handleSelectGIF=",
        replacement: {
            match: /\.handleSelectGIF=function.+?\{/,
            replace: ".handleSelectGIF=function(gif){return $self.handleSelect(gif);"
        }
    }],

    handleSelect(gif?: { url: string; }) {
        if (gif) {
            ComponentDispatch.dispatchToLastSubscribed("INSERT_TEXT", { rawText: gif.url + " " });
            ExpressionPickerState.close();
        }
    }
});
