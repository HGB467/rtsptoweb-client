import React, { useState } from "react";
import { Modal, Input, Select, Button } from "antd";
import { addStream } from "../../utils/streams";
import { STREAM_TYPES } from "../../utils/general";

const { Option } = Select;

const RTSPModal = ({ open, onCancel, fetchStreams }) => {
  const [rtspLink, setRtspLink] = useState("");
  const [streamType, setStreamType] = useState("WEBRTC");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [encodingOptions, setEncodingOptions] = useState("none");
  const [segmentDuration, setSegmentDuration] = useState(2);
  const [playlistRetention, setPlaylistRetention] = useState(60);

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      if (!rtspLink) {
        setError("RTSP link is required");
        setLoading(false);
        return;
      }

      await addStream(rtspLink, streamType, encodingOptions, {
        duration: segmentDuration,
        max_files: Math.ceil(playlistRetention/segmentDuration),
      });

      fetchStreams();

      setTimeout(() => {
        fetchStreams();
      }, 3 * 1000);

      setLoading(false);
      resetDefaults()
      onCancel();
    } catch (e) {
      setError(e?.toString() || "An error occurred. Please try again");
      setLoading(false);
    }
  };

  function resetDefaults(){
    setRtspLink('')
    setStreamType("WEBRTC")
    setEncodingOptions('none')
    setSegmentDuration(2)
    setPlaylistRetention(60)
  }

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      title="Add Stream"
      className="rounded-xl"
    >
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Stream URL
        </label>
        <Input
          placeholder="Enter RTSP link"
          value={rtspLink}
          onChange={(e) => setRtspLink(e.target.value)}
          className="rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Stream Type
        </label>
        <Select
          value={streamType}
          onChange={(value) => setStreamType(value)}
          className="w-full rounded-md focus:ring-2 focus:ring-blue-500"
        >
          <Option value="WEBRTC">WebRTC</Option>
          <Option value="HLS">HLS</Option>
        </Select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Re-Encoding
        </label>
        <Select
          value={encodingOptions}
          onChange={(value) => setEncodingOptions(value)}
          className="w-full rounded-md focus:ring-2 focus:ring-blue-500"
        >
          <Option value="none">
            Do Not Re-encode (Optimized For CPU)
          </Option>
          <Option value="single">
            Re-encode Once (Optimized For Smooth Stream)
          </Option>
          <Option value="multi">
            {streamType === STREAM_TYPES.WEBRTC
              ? "Re-encode Based On User's Network"
              : "Re-encode At Three Qualities"}{" "}
            (Optimized For Varying Network)
          </Option>
        </Select>
      </div>

      {streamType === "HLS" && (
        <>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Segment Duration
            </label>
            <Select
              value={segmentDuration}
              onChange={(value) => setSegmentDuration(value)}
              className="w-full rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <Option value={2}>LLHLS (2 Secs)</Option>
              <Option value={5}>HLS (5 Secs)</Option>
              <Option value={10}>HLS (10 Secs)</Option>
            </Select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Playlist Retention
            </label>
            <Select
              value={playlistRetention}
              onChange={(value) => setPlaylistRetention(value)}
              className="w-full rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <Option value={60}>1 Minute</Option>
              <Option value={3600}>1 Hour</Option>
              <Option value={36000}>10 Hours</Option>
              <Option value={86400}>1 Day</Option>
              <Option value={259200}>3 Days</Option>
            </Select>
          </div>
        </>
      )}

      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-100 p-2 rounded-md">
          {error}
        </div>
      )}

      <div className="flex justify-end">
        <Button
          onClick={onCancel}
          className="mr-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md"
        >
          Cancel
        </Button>
        <Button
          type="primary"
          onClick={handleSubmit}
          loading={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-md"
        >
          Submit
        </Button>
      </div>
    </Modal>
  );
};

export default RTSPModal;
