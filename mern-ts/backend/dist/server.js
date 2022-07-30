"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("./util/config"));
const app = (0, express_1.default)();
app.get("/", (req, res) => {
    res.status(200).json({ message: "Success with ts and node" });
});
const port = config_1.default.PORT;
app.listen(port, () => {
    console.log(`\nServer running on ---> http://localhost:${port}\n`);
});
//# sourceMappingURL=server.js.map