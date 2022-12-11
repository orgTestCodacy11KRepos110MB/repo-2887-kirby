<?php

namespace Kirby\Cms;

use Kirby\Filesystem\Dir;
use Kirby\Filesystem\F;
use PHPUnit\Framework\TestCase;

class MediaTest extends TestCase
{
	protected $app;
	protected $fixtures = __DIR__ . '/fixtures';
	protected $tmp;

	public function setUp(): void
	{
		$this->app = new App([
			'roots' => [
				'index' => $this->tmp = __DIR__ . '/tmp',
			],
		]);

		Dir::make($this->tmp);
	}

	public function tearDown(): void
	{
		Dir::remove($this->tmp);
	}

	public function testLinkSiteFile()
	{
		F::write(
			$this->tmp . '/content/test.svg',
			'<svg xmlns="http://www.w3.org/2000/svg"/>'
		);

		$file   = $this->app->file('test.svg');
		$result = Media::link(
			$this->app->site(),
			$file->mediaHash(),
			$file->filename()
		);

		$this->assertInstanceOf(Response::class, $result);
		$this->assertEquals(200, $result->code());
		$this->assertEquals('image/svg+xml', $result->type());
	}

	public function testLinkPageFile()
	{
		F::write(
			$this->tmp . '/content/projects/test.svg',
			'<svg xmlns="http://www.w3.org/2000/svg"/>'
		);

		$file   = $this->app->file('projects/test.svg');
		$result = Media::link(
			$this->app->page('projects'),
			$file->mediaHash(),
			$file->filename()
		);

		$this->assertInstanceOf(Response::class, $result);
		$this->assertEquals(200, $result->code());
		$this->assertEquals('image/svg+xml', $result->type());
	}

	public function testLinkWithInvalidHash()
	{
		F::write(
			$this->tmp . '/content/projects/test.svg',
			'<svg xmlns="http://www.w3.org/2000/svg"/>'
		);

		// with the correct media token
		$file   = $this->app->file('projects/test.svg');
		$result = Media::link(
			$this->app->page('projects'),
			$file->mediaToken() . '-12345',
			$file->filename()
		);

		$this->assertInstanceOf(Response::class, $result);
		$this->assertEquals(307, $result->code());

		// with a completely invalid hash
		$file   = $this->app->file('projects/test.svg');
		$result = Media::link(
			$this->app->page('projects'),
			'abcde-12345',
			$file->filename()
		);

		$this->assertFalse($result);
	}

	public function testLinkWithoutModel()
	{
		$this->assertFalse(Media::link(null, 'hash', 'filename.jpg'));
	}

	public function testPublish()
	{
		F::write($this->tmp . '/content/test.jpg', 'nice jpg');

		$file = new File([
			'kirby'    => $this->app,
			'parent'   => new Site(),
			'filename' => $filename = 'test.jpg'
		]);

		$oldToken  = crc32($filename);
		$newToken  = $file->mediaToken();
		$directory = $this->tmp . '/media/site';

		Dir::make($versionA1 = $directory . '/' . $oldToken . '-1234');
		Dir::make($versionA2 = $directory . '/' . $oldToken . '-5678');
		Dir::make($versionB1 = $directory . '/' . $newToken . '-1234');
		Dir::make($versionB2 = $directory . '/' . $newToken . '-5678');

		$publish = Media::publish($file, $dest = $versionB2 . '/test.jpg');
		$this->assertTrue($publish);

		// the file should be copied
		$this->assertTrue(is_dir($versionB2));
		$this->assertTrue(is_file($dest));

		// older versions should be removed
		$this->assertFalse(is_dir($versionA1));
		$this->assertFalse(is_dir($versionA2));
		$this->assertFalse(is_dir($versionB1));
	}

	public function testUnpublish()
	{
		F::write($this->tmp . '/content/test.jpg', 'nice jpg');

		$file = new File([
			'kirby'    => $this->app,
			'parent'   => new Page(['slug' => 'test']),
			'filename' => $filename = 'test.jpg'
		]);

		$oldToken  = crc32($filename);
		$newToken  = $file->mediaToken();
		$directory = $this->tmp . '/media/site';

		Dir::make($versionA1 = $directory . '/' . $oldToken . '-1234');
		Dir::make($versionA2 = $directory . '/' . $oldToken . '-5678');
		Dir::make($versionB1 = $directory . '/' . $newToken . '-1234');
		Dir::make($versionB2 = $directory . '/' . $newToken . '-5678');

		$this->assertTrue(is_dir($versionA1));
		$this->assertTrue(is_dir($versionA2));
		$this->assertTrue(is_dir($versionB1));
		$this->assertTrue(is_dir($versionB2));

		Media::unpublish($directory, $file);

		$this->assertFalse(is_dir($versionA1));
		$this->assertFalse(is_dir($versionA2));
		$this->assertFalse(is_dir($versionB1));
		$this->assertFalse(is_dir($versionB2));
	}

	public function testUnpublishAndIgnore()
	{
		F::write($this->tmp . '/content/test.jpg', 'nice jpg');

		$file = new File([
			'kirby'    => $this->app,
			'parent'   => new Page(['slug' => 'test']),
			'filename' => $filename = 'test.jpg'
		]);

		$oldToken  = crc32($filename);
		$newToken  = $file->mediaToken();
		$directory = $this->tmp . '/media/site';

		Dir::make($versionA1 = $directory . '/' . $oldToken . '-1234');
		Dir::make($versionA2 = $directory . '/' . $oldToken . '-5678');
		Dir::make($versionB1 = $directory . '/' . $newToken . '-1234');
		Dir::make($versionB2 = $directory . '/' . $newToken . '-5678');

		$this->assertTrue(is_dir($versionA1));
		$this->assertTrue(is_dir($versionA2));
		$this->assertTrue(is_dir($versionB1));
		$this->assertTrue(is_dir($versionB2));

		Media::unpublish($directory, $file, $versionB1);

		$this->assertTrue(is_dir($versionB1));
		$this->assertFalse(is_dir($versionA1));
		$this->assertFalse(is_dir($versionA2));
		$this->assertFalse(is_dir($versionB2));
	}

	public function testUnpublishNonExistingDirectory()
	{
		$directory = $this->tmp . '/does-not-exist';

		$file = new File([
			'kirby'    => $this->app,
			'parent'   => new Page(['slug' => 'test']),
			'filename' => 'does-not-exist.jpg'
		]);

		$this->assertTrue(Media::unpublish($directory, $file));
	}

	public function testThumb()
	{
		Dir::make($this->tmp . '/content');

		// copy test image to content
		F::copy(
			$this->fixtures . '/test.jpg',
			$this->tmp . '/content/test.jpg'
		);

		// get file object
		$file  = $this->app->file('test.jpg');
		Dir::make(dirname($file->mediaRoot()));
		$this->assertInstanceOf(File::class, $file);

		// invalid with no job file
		$thumb = Media::thumb($file, $file->mediaHash(), $file->filename());
		$this->assertFalse($thumb);

		// invalid with empty job file
		F::write(dirname($file->mediaRoot()) . '/.jobs/' . $file->filename() . '.json', '{}');
		$thumb = Media::thumb($file, $file->mediaHash(), $file->filename());
		$this->assertFalse($thumb);

		// create job file
		$jobString = '{"width":64,"height":64,"quality":null,"crop":"center","filename":"test.jpg"}';
		F::write(dirname($file->mediaRoot()) . '/.jobs/' . $file->filename() . '.json', $jobString);

		// invalid with file not found
		$thumb = Media::thumb($file, $file->mediaHash(), $file->filename());
		$this->assertInstanceOf(Response::class, $thumb);
		$this->assertSame('', $thumb->body());

		// copy to media folder
		$file->asset()->copy($mediaPath = $file->mediaRoot());

		$thumb = Media::thumb($file, $file->mediaHash(), $file->filename());
		$this->assertInstanceOf(Response::class, $thumb);
		$this->assertNotFalse($thumb->body());
		$this->assertSame(200, $thumb->code());
		$this->assertSame('image/jpeg', $thumb->type());

		$thumbInfo = getimagesize($mediaPath);
		$this->assertSame(64, $thumbInfo[0]);
		$this->assertSame(64, $thumbInfo[1]);
	}

	public function testThumbStringModel()
	{
		Dir::make($this->tmp . '/content');

		// copy test image to content
		F::copy(
			$this->fixtures . '/test.jpg',
			$this->tmp . '/content/test.jpg'
		);

		// get file object
		$file  = $this->app->file('test.jpg');
		Dir::make($this->tmp . '/media/assets/site/' . $file->mediaHash());
		$this->assertInstanceOf(File::class, $file);

		// create job file
		$jobString = '{"width":64,"height":64,"quality":null,"crop":"center","filename":"test.jpg"}';
		F::write($this->tmp . '/media/assets/site/' . $file->mediaHash() . '/.jobs/' . $file->filename() . '.json', $jobString);

		// copy to media folder
		$file->asset()->copy($mediaPath = $this->tmp . '/media/assets/site/' . $file->mediaHash() . '/' . $file->filename());

		$thumb = Media::thumb('site', $file->mediaHash(), $file->filename());
		$this->assertInstanceOf(Response::class, $thumb);
		$this->assertNotFalse($thumb->body());
		$this->assertSame(200, $thumb->code());
		$this->assertSame('image/jpeg', $thumb->type());

		$thumbInfo = getimagesize($mediaPath);
		$this->assertSame(64, $thumbInfo[0]);
		$this->assertSame(64, $thumbInfo[1]);
	}
}
