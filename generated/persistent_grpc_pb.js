// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var persistent_pb = require('./persistent_pb.js');
var shared_pb = require('./shared_pb.js');

function serialize_event_store_client_persistent_subscriptions_CreateReq(arg) {
  if (!(arg instanceof persistent_pb.CreateReq)) {
    throw new Error('Expected argument of type event_store.client.persistent_subscriptions.CreateReq');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_event_store_client_persistent_subscriptions_CreateReq(buffer_arg) {
  return persistent_pb.CreateReq.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_event_store_client_persistent_subscriptions_CreateResp(arg) {
  if (!(arg instanceof persistent_pb.CreateResp)) {
    throw new Error('Expected argument of type event_store.client.persistent_subscriptions.CreateResp');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_event_store_client_persistent_subscriptions_CreateResp(buffer_arg) {
  return persistent_pb.CreateResp.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_event_store_client_persistent_subscriptions_DeleteReq(arg) {
  if (!(arg instanceof persistent_pb.DeleteReq)) {
    throw new Error('Expected argument of type event_store.client.persistent_subscriptions.DeleteReq');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_event_store_client_persistent_subscriptions_DeleteReq(buffer_arg) {
  return persistent_pb.DeleteReq.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_event_store_client_persistent_subscriptions_DeleteResp(arg) {
  if (!(arg instanceof persistent_pb.DeleteResp)) {
    throw new Error('Expected argument of type event_store.client.persistent_subscriptions.DeleteResp');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_event_store_client_persistent_subscriptions_DeleteResp(buffer_arg) {
  return persistent_pb.DeleteResp.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_event_store_client_persistent_subscriptions_ReadReq(arg) {
  if (!(arg instanceof persistent_pb.ReadReq)) {
    throw new Error('Expected argument of type event_store.client.persistent_subscriptions.ReadReq');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_event_store_client_persistent_subscriptions_ReadReq(buffer_arg) {
  return persistent_pb.ReadReq.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_event_store_client_persistent_subscriptions_ReadResp(arg) {
  if (!(arg instanceof persistent_pb.ReadResp)) {
    throw new Error('Expected argument of type event_store.client.persistent_subscriptions.ReadResp');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_event_store_client_persistent_subscriptions_ReadResp(buffer_arg) {
  return persistent_pb.ReadResp.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_event_store_client_persistent_subscriptions_UpdateReq(arg) {
  if (!(arg instanceof persistent_pb.UpdateReq)) {
    throw new Error('Expected argument of type event_store.client.persistent_subscriptions.UpdateReq');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_event_store_client_persistent_subscriptions_UpdateReq(buffer_arg) {
  return persistent_pb.UpdateReq.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_event_store_client_persistent_subscriptions_UpdateResp(arg) {
  if (!(arg instanceof persistent_pb.UpdateResp)) {
    throw new Error('Expected argument of type event_store.client.persistent_subscriptions.UpdateResp');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_event_store_client_persistent_subscriptions_UpdateResp(buffer_arg) {
  return persistent_pb.UpdateResp.deserializeBinary(new Uint8Array(buffer_arg));
}


var PersistentSubscriptionsService = exports.PersistentSubscriptionsService = {
  create: {
    path: '/event_store.client.persistent_subscriptions.PersistentSubscriptions/Create',
    requestStream: false,
    responseStream: false,
    requestType: persistent_pb.CreateReq,
    responseType: persistent_pb.CreateResp,
    requestSerialize: serialize_event_store_client_persistent_subscriptions_CreateReq,
    requestDeserialize: deserialize_event_store_client_persistent_subscriptions_CreateReq,
    responseSerialize: serialize_event_store_client_persistent_subscriptions_CreateResp,
    responseDeserialize: deserialize_event_store_client_persistent_subscriptions_CreateResp,
  },
  update: {
    path: '/event_store.client.persistent_subscriptions.PersistentSubscriptions/Update',
    requestStream: false,
    responseStream: false,
    requestType: persistent_pb.UpdateReq,
    responseType: persistent_pb.UpdateResp,
    requestSerialize: serialize_event_store_client_persistent_subscriptions_UpdateReq,
    requestDeserialize: deserialize_event_store_client_persistent_subscriptions_UpdateReq,
    responseSerialize: serialize_event_store_client_persistent_subscriptions_UpdateResp,
    responseDeserialize: deserialize_event_store_client_persistent_subscriptions_UpdateResp,
  },
  delete: {
    path: '/event_store.client.persistent_subscriptions.PersistentSubscriptions/Delete',
    requestStream: false,
    responseStream: false,
    requestType: persistent_pb.DeleteReq,
    responseType: persistent_pb.DeleteResp,
    requestSerialize: serialize_event_store_client_persistent_subscriptions_DeleteReq,
    requestDeserialize: deserialize_event_store_client_persistent_subscriptions_DeleteReq,
    responseSerialize: serialize_event_store_client_persistent_subscriptions_DeleteResp,
    responseDeserialize: deserialize_event_store_client_persistent_subscriptions_DeleteResp,
  },
  read: {
    path: '/event_store.client.persistent_subscriptions.PersistentSubscriptions/Read',
    requestStream: true,
    responseStream: true,
    requestType: persistent_pb.ReadReq,
    responseType: persistent_pb.ReadResp,
    requestSerialize: serialize_event_store_client_persistent_subscriptions_ReadReq,
    requestDeserialize: deserialize_event_store_client_persistent_subscriptions_ReadReq,
    responseSerialize: serialize_event_store_client_persistent_subscriptions_ReadResp,
    responseDeserialize: deserialize_event_store_client_persistent_subscriptions_ReadResp,
  },
};

exports.PersistentSubscriptionsClient = grpc.makeGenericClientConstructor(PersistentSubscriptionsService);
