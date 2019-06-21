import * as assert from 'assert';
import * as vscode from 'vscode';
import { HistoryProvider, HistoryEntry } from '../history';
import { deleteGifFromHistory } from '../deleteGif';

suite('deleteGif removes a Gif from history', function() {
	test('given a a Gif to remove, deleteGif correctly removes it from the tree view and the global state', async function() {
		const extension = vscode.extensions.getExtension('giflens.giflens');
		const state: undefined | vscode.Memento = extension
			? extension.exports.state
			: undefined;

		if (state) {
			// add an entry to the history
			const gif = new HistoryEntry('test', 'test');
			const historyTreeView = new HistoryProvider(state);
			const waiter = await state.update('history', [gif]);
			assert(state.get('history'));
			// then deletes it
			deleteGifFromHistory(gif, state, historyTreeView);
			const final: HistoryEntry[] | undefined = state.get('history');
			if (final) {
				assert(final.length === 0);
			} else {
				assert(false);
			}
			return waiter;
		} else {
			assert(false);
		}
	});
});
