#Abstraction.js

A module for node.js and the web browser that maintains a cross-device
abstraction layer.

Essentially, the server maintains a "space" for objects that clients
can add to and update. The server may act as a client of another server
to produce a hierarchical orgainization of spaces.

Spaces are indexed by name and id. Each name must be unique within its space,
and each id must be unique within its space and name.
(The idea here is that the name denotes an assembly, module, or package containing objects.)

On the server, spaces are persisted by means of a backing store.

Transactions may be performed. All transactions are simply queries accompanied by
a list of object ids (which, if from other spaces, may also include the space name)
and a version number. If any of the listed objects have been updated or deleted
since the specified version, then the transaction fails. Upon failure, the server
sends updated objects to the client.

Clients may disconnect from a space, and be re-synchronized upon reconnection
to that space. Re-synchronization is merely a query for all objects that may
have been updated since the last synchronization. Each space maintains a
current version number, and each object keeps the version number of its last
update. It is sufficient for a synchronization query to specify the
last-validated version number, which prompts the server to reply with all
objects that have been added/updated/removed since that version.

---
This project is copyrighted under the terms of the [MIT License.](LICENSE.md) 
