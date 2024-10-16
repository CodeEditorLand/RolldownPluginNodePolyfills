"use strict";

var TYPED_OK =
	typeof Uint8Array !== "undefined" &&
	typeof Uint16Array !== "undefined" &&
	typeof Int32Array !== "undefined";

export function assign(obj /*from1, from2, from3, ...*/) {
	var sources = Array.prototype.slice.call(arguments, 1);
	while (sources.length) {
		var source = sources.shift();
		if (!source) {
			continue;
		}

		if (typeof source !== "object") {
			throw new TypeError(source + "must be non-object");
		}

		for (var p in source) {
			if (source.hasOwnProperty(p)) {
				obj[p] = source[p];
			}
		}
	}

	return obj;
}

// reduce buffer size, avoiding mem copy
export function shrinkBuf(buf, size) {
	if (buf.length === size) {
		return buf;
	}
	if (buf.subarray) {
		return buf.subarray(0, size);
	}
	buf.length = size;
	return buf;
}
export function arraySet(dest, src, src_offs, len, dest_offs) {
	if (src.subarray && dest.subarray) {
		dest.set(src.subarray(src_offs, src_offs + len), dest_offs);
		return;
	}
	// Fallback to ordinary array
	for (var i = 0; i < len; i++) {
		dest[dest_offs + i] = src[src_offs + i];
	}
}
export function flattenChunks(chunks) {
	var i, l, len, pos, chunk, result;

	// calculate data length
	len = 0;
	for (i = 0, l = chunks.length; i < l; i++) {
		len += chunks[i].length;
	}

	// join chunks
	result = new Uint8Array(len);
	pos = 0;
	for (i = 0, l = chunks.length; i < l; i++) {
		chunk = chunks[i];
		result.set(chunk, pos);
		pos += chunk.length;
	}

	return result;
}

export var Buf8 = Uint8Array;
export var Buf16 = Uint16Array;
export var Buf32 = Int32Array;
// Enable/Disable typed arrays use, for testing
//
